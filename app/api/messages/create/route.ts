import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { toMessageDTO, toConversationThreadDTO } from "@/lib/dto";
import { generateEmbedding, classifyMessage } from "@/lib/ai/openai";
import { log } from "@/lib/logger";
import { featureEnabled } from "@/lib/featureFlags";
import {
  withValidationAndRateLimit,
  createErrorResponse,
  createSuccessResponse,
  RATE_LIMITS,
} from "@/lib/validation/middleware";
import { CreateMessageSchema, MessageDTOSchema } from "@/lib/validation/schemas";

async function createMessageHandler(req: NextRequest, data: any) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse(
        "Database not available. Please enable demo mode.",
        503
      );
    }

    const user = await getCurrentUser(req);
    const { type, content, fileUrl, url, threadId } = data;

    // Validate message type requirements
    if (type === "text" && !content) {
      return createErrorResponse("Content is required for text messages", 400);
    }
    if ((type === "audio" || type === "image" || type === "file") && !fileUrl) {
      return createErrorResponse("File URL is required for file-based messages", 400);
    }
    if (type === "link" && !url) {
      return createErrorResponse("URL is required for link messages", 400);
    }

    // Determine or create thread
    let targetThreadId = threadId;
    
    if (!targetThreadId) {
      // TODO: Implement thread matching based on similarity
      // For now, create a new thread
      const newThread = await prisma.conversationThread.create({
        data: {
          userId: user.id,
          title: type === "text" ? content?.slice(0, 50) : null,
          systemTags: [],
        },
      });
      targetThreadId = newThread.id;
    } else {
      // Verify thread belongs to user
      const thread = await prisma.conversationThread.findFirst({
        where: {
          id: targetThreadId,
          userId: user.id,
        },
      });
      
      if (!thread) {
        return createErrorResponse("Thread not found", 404);
      }
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        type,
        content: type === "text" ? content : null,
        fileUrl: fileUrl || (type === "link" ? url : null),
        transcription: null, // Will be populated by transcription job
        metadata: type === "link" ? { url } : null,
        threadId: targetThreadId,
        userId: user.id,
      },
      include: {
        thread: true,
      },
    });

    // Background processing (fire-and-forget)
    Promise.all([
      // Generate embedding if enabled
      (async () => {
        try {
          if (await featureEnabled("embeddings", user.id)) {
            // Only embed if we have text content
            const textToEmbed = message.type === "audio" 
              ? message.transcription 
              : message.content;
            
            if (textToEmbed && textToEmbed.trim().length > 0) {
              const embedding = await generateEmbedding(textToEmbed);
              
              if (embedding.length > 0) {
                // Store embedding using raw SQL (pgvector)
                await (prisma as any).$executeRaw`
                  UPDATE messages
                  SET embedding = ${JSON.stringify(embedding)}::vector
                  WHERE id = ${message.id}
                `;
                log.info("Generated embedding for message", { messageId: message.id });
              }
            }
          }
        } catch (err) {
          log.error("Embedding generation error", { messageId: message.id, error: err });
        }
      })(),
      
      // Classify message if enabled
      (async () => {
        try {
          if (await featureEnabled("classification", user.id)) {
            // Only classify if we have text content
            const textToClassify = message.type === "audio" 
              ? message.transcription 
              : message.content;
            
            if (textToClassify && textToClassify.trim().length > 0) {
              const classification = await classifyMessage(textToClassify);
              
              // Update message metadata
              await prisma.message.update({
                where: { id: message.id },
                data: {
                  metadata: {
                    topics: classification.topics,
                    summary: classification.summary,
                    sentiment: classification.sentiment,
                  },
                },
              });
              
              // Update thread with classification
              await prisma.conversationThread.update({
                where: { id: targetThreadId },
                data: {
                  systemTags: classification.topics.length > 0 
                    ? classification.topics 
                    : undefined,
                  title: message.thread.title || classification.summary.slice(0, 50) || undefined,
                },
              });
              
              log.info("Classified message", { messageId: message.id, topics: classification.topics });
            }
          }
        } catch (err) {
          log.error("Classification error", { messageId: message.id, error: err });
        }
      })(),
      
      // TODO: Implement audio transcription if type === "audio"
      // TODO: Implement thread matching using pgvector similarity
    ]).catch((err) => log.error("Background processing error", err));

    // Return message with thread
    const messageDTO = toMessageDTO(message);
    const threadDTO = toConversationThreadDTO(message.thread);

    const response = {
      ...messageDTO,
      thread: threadDTO,
    };

    // Validate message DTO
    const validation = MessageDTOSchema.safeParse(messageDTO);
    if (!validation.success) {
      console.error("Response validation failed:", validation.error);
      return createErrorResponse("Invalid response format", 500);
    }

    log.info("Message created", { messageId: message.id, threadId: targetThreadId });
    return createSuccessResponse(response);
  } catch (error) {
    log.error("Create message error", error);
    return createErrorResponse("Failed to create message", 500);
  }
}

export const POST = withValidationAndRateLimit(
  CreateMessageSchema,
  RATE_LIMITS.CREATE_NOTE, // Reuse note rate limit for now
  createMessageHandler
);

