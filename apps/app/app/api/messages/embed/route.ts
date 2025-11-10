import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { generateEmbedding } from "@/lib/ai/openai";
import { log } from "@/lib/logger";
import { featureEnabled } from "@/lib/featureFlags";
import {
  withValidationAndRateLimit,
  createErrorResponse,
  createSuccessResponse,
  RATE_LIMITS,
} from "@/lib/validation/middleware";
import { EmbedMessageSchema } from "@/lib/validation/schemas";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function embedMessageHandler(req: NextRequest, data: any) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse(
        "Database not available. Please enable demo mode.",
        503
      );
    }

    const user = await getCurrentUser(req);
    const { messageId } = data;

    // Check feature flag
    if (!(await featureEnabled("embeddings", user.id))) {
      return createErrorResponse("Embeddings feature is disabled", 403);
    }

    // Find message and verify ownership
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        userId: user.id,
      },
    });

    if (!message) {
      return createErrorResponse("Message not found", 404);
    }

    // Skip if already embedded
    if (message.embedding) {
      return createSuccessResponse({ message: "Message already embedded" });
    }

    // Get text to embed (content or transcription)
    const textToEmbed = message.type === "audio" 
      ? message.transcription 
      : message.content;

    if (!textToEmbed || textToEmbed.trim().length === 0) {
      return createErrorResponse("No text content available for embedding", 400);
    }

    // Generate embedding
    const embedding = await generateEmbedding(textToEmbed);

    if (embedding.length === 0) {
      return createErrorResponse("Failed to generate embedding", 500);
    }

    // Store embedding using raw SQL (pgvector)
    await (prisma as any).$executeRaw`
      UPDATE messages
      SET embedding = ${JSON.stringify(embedding)}::vector
      WHERE id = ${messageId}
    `;

    log.info("Generated embedding", { messageId, length: embedding.length });
    return createSuccessResponse({ 
      success: true, 
      embeddingLength: embedding.length 
    });
  } catch (error) {
    log.error("Embed message error", error);
    return createErrorResponse("Failed to embed message", 500);
  }
}

export const POST = withValidationAndRateLimit(
  EmbedMessageSchema,
  RATE_LIMITS.CREATE_NOTE, // Reuse note rate limit for now
  embedMessageHandler
);

