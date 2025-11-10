import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import {
  withValidationAndRateLimit,
  createErrorResponse,
  createSuccessResponse,
  RATE_LIMITS,
} from "@/lib/validation/middleware";
import { EmbedMessageSchema } from "@/lib/validation/schemas";

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

    if (!textToEmbed) {
      return createErrorResponse("No text content available for embedding", 400);
    }

    // TODO: Implement OpenAI embedding generation
    // const embedding = await openai.embeddings.create({
    //   model: "text-embedding-3-small",
    //   input: textToEmbed,
    // });
    // 
    // await prisma.$executeRaw`
    //   UPDATE messages
    //   SET embedding = ${JSON.stringify(embedding.data[0].embedding)}::vector
    //   WHERE id = ${messageId}
    // `;

    return createSuccessResponse({ message: "Embedding queued (placeholder)" });
  } catch (error) {
    console.error("[messages] Embed message error:", error);
    return createErrorResponse("Failed to embed message", 500);
  }
}

export const POST = withValidationAndRateLimit(
  EmbedMessageSchema,
  RATE_LIMITS.CREATE_NOTE, // Reuse note rate limit for now
  embedMessageHandler
);

