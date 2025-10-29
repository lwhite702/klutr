import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { toNoteDTO } from "@/lib/dto";
import { classifyNoteContent } from "@/lib/ai/classifyNote";
import { embedNoteContent } from "@/lib/ai/embedNote";
import { 
  withValidationAndRateLimit, 
  createErrorResponse, 
  createSuccessResponse,
  RATE_LIMITS 
} from "@/lib/validation/middleware";
import { CreateNoteSchema, NoteDTOSchema } from "@/lib/validation/schemas";

async function createNoteHandler(req: NextRequest, data: any) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse("Database not available. Please enable demo mode.", 503);
    }

    const user = await getCurrentUser(req);
    const { content, type } = data;

    // Create the note first
    const note = await prisma.note.create({
      data: {
        userId: user.id,
        content,
        type: type || "misc",
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Classify and embed in background (fire-and-forget for better UX)
    Promise.all([
      (async () => {
        try {
          const classification = await classifyNoteContent(content);

          // Upsert tags
          const tagRecords = await Promise.all(
            classification.tags.map((tagName) =>
              prisma.tag.upsert({
                where: {
                  userId_name: {
                    userId: user.id,
                    name: tagName,
                  },
                },
                create: {
                  userId: user.id,
                  name: tagName,
                },
                update: {},
              }),
            ),
          );

          // Update note with classification and tags
          await prisma.note.update({
            where: { id: note.id },
            data: {
              type: classification.type,
              tags: {
                create: tagRecords.map((tag) => ({
                  tagId: tag.id,
                })),
              },
            },
          });
        } catch (error) {
          console.error("[v0] Classification failed:", error);
        }
      })(),
      (async () => {
        try {
          const embedding = await embedNoteContent(content);

          // Store embedding using raw SQL (pgvector)
          await prisma.$executeRaw`
            UPDATE notes
            SET embedding = ${JSON.stringify(embedding)}::vector
            WHERE id = ${note.id}
          `;
        } catch (error) {
          console.error("[v0] Embedding failed:", error);
        }
      })(),
    ]).catch((err) => console.error("[v0] Background processing error:", err));

    // Validate response before sending
    const noteDTO = toNoteDTO(note);
    const validation = NoteDTOSchema.safeParse(noteDTO);
    
    if (!validation.success) {
      console.error("Response validation failed:", validation.error);
      return createErrorResponse("Invalid response format", 500);
    }

    return createSuccessResponse(validation.data);
  } catch (error) {
    console.error("[v0] Create note error:", error);
    return createErrorResponse("Failed to create note", 500);
  }
}

export const POST = withValidationAndRateLimit(
  CreateNoteSchema,
  RATE_LIMITS.CREATE_NOTE,
  createNoteHandler
);
