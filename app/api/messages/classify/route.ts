import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { classifyMessage } from "@/lib/ai/openai";
import { log } from "@/lib/logger";
import { featureEnabled } from "@/lib/featureFlags";
import { toConversationThreadDTO } from "@/lib/dto";
import {
  withValidationAndRateLimit,
  createErrorResponse,
  createSuccessResponse,
  RATE_LIMITS,
} from "@/lib/validation/middleware";
import { ClassifyMessageSchema, ConversationThreadDTOSchema } from "@/lib/validation/schemas";

async function classifyMessageHandler(req: NextRequest, data: any) {
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
    if (!(await featureEnabled("classification", user.id))) {
      return createErrorResponse("Classification feature is disabled", 403);
    }

    // Find message and verify ownership
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        userId: user.id,
      },
      include: {
        thread: true,
      },
    });

    if (!message) {
      return createErrorResponse("Message not found", 404);
    }

    // Get text to classify (content or transcription)
    const textToClassify = message.type === "audio" 
      ? message.transcription 
      : message.content;

    if (!textToClassify || textToClassify.trim().length === 0) {
      return createErrorResponse("No text content available for classification", 400);
    }

    // Classify message
    const classification = await classifyMessage(textToClassify);

    // Update message metadata
    await prisma.message.update({
      where: { id: messageId },
      data: {
        metadata: {
          ...(message.metadata as Record<string, any> || {}),
          topics: classification.topics,
          summary: classification.summary,
          sentiment: classification.sentiment,
        },
      },
    });

    // Update thread with classification (use topics as system_tags)
    const updatedThread = await prisma.conversationThread.update({
      where: { id: message.threadId },
      data: {
        systemTags: classification.topics.length > 0 
          ? classification.topics 
          : message.thread.system_tags || message.thread.systemTags || [],
        // Update title if thread doesn't have one and we have a summary
        title: message.thread.title || classification.summary.slice(0, 50) || undefined,
      },
    });

    log.info("Classified message", { messageId, topics: classification.topics, sentiment: classification.sentiment });

    const threadDTO = toConversationThreadDTO(updatedThread);
    return createSuccessResponse(threadDTO, ConversationThreadDTOSchema);
  } catch (error) {
    log.error("Classify message error", error);
    return createErrorResponse("Failed to classify message", 500);
  }
}

export const POST = withValidationAndRateLimit(
  ClassifyMessageSchema,
  RATE_LIMITS.CREATE_NOTE, // Reuse note rate limit for now
  classifyMessageHandler
);

