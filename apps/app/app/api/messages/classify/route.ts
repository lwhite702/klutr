import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
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

    if (!textToClassify) {
      return createErrorResponse("No text content available for classification", 400);
    }

    // TODO: Implement OpenAI classification
    // const classification = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "Classify this message and suggest thread title and tags. Return JSON with 'title' and 'tags' array.",
    //     },
    //     {
    //       role: "user",
    //       content: textToClassify,
    //     },
    //   ],
    // });
    // 
    // const result = JSON.parse(classification.choices[0].message.content);
    // 
    // // Update thread with classification
    // const updatedThread = await prisma.conversationThread.update({
    //   where: { id: message.threadId },
    //   data: {
    //     title: result.title || undefined,
    //     system_tags: result.tags || [],
    //   },
    // });

    // Placeholder: return current thread
    const threadDTO = toConversationThreadDTO(message.thread);

    return createSuccessResponse(threadDTO, ConversationThreadDTOSchema);
  } catch (error) {
    console.error("[messages] Classify message error:", error);
    return createErrorResponse("Failed to classify message", 500);
  }
}

export const POST = withValidationAndRateLimit(
  ClassifyMessageSchema,
  RATE_LIMITS.CREATE_NOTE, // Reuse note rate limit for now
  classifyMessageHandler
);

