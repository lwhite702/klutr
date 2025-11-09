import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { toNoteDTO } from "@/lib/dto";
import { tagNotes } from "@/lib/ai/tagNotes";
import {
  withValidationAndRateLimit,
  createErrorResponse,
  createSuccessResponse,
  RATE_LIMITS,
} from "@/lib/validation/middleware";
import { CreateStreamDropSchema, NoteDTOSchema } from "@/lib/validation/schemas";

async function createStreamDropHandler(req: NextRequest, data: any) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse(
        "Database not available. Please enable demo mode.",
        503
      );
    }

    const user = await getCurrentUser(req);
    const { content, dropType, fileUrl, fileName, fileType, type } = data;

    // Create the note with Stream fields
    const note = await prisma.note.create({
      data: {
        userId: user.id,
        content,
        type: type || "misc",
        dropType: dropType || "text",
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        fileType: fileType || null,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Tag the note in background
    Promise.resolve()
      .then(async () => {
        try {
          const tags = await tagNotes(content);
          
          // Upsert tags
          const tagRecords = await Promise.all(
            tags.map((tagName) =>
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
              })
            )
          );

          // Update note with tags
          await prisma.note.update({
            where: { id: note.id },
            data: {
              tags: {
                create: tagRecords.map((tag) => ({
                  tagId: tag.id,
                })),
              },
            },
          });
        } catch (error) {
          console.error("[v0] Tagging failed:", error);
        }
      })
      .catch((err) => console.error("[v0] Background tagging error:", err));

    // Validate response before sending
    const noteDTO = toNoteDTO(note);
    const validation = NoteDTOSchema.safeParse(noteDTO);

    if (!validation.success) {
      console.error("Response validation failed:", validation.error);
      return createErrorResponse("Invalid response format", 500);
    }

    return createSuccessResponse(validation.data, NoteDTOSchema);
  } catch (error) {
    console.error("[v0] Create stream drop error:", error);
    return createErrorResponse("Failed to create stream drop", 500);
  }
}

export const POST = withValidationAndRateLimit(
  CreateStreamDropSchema,
  RATE_LIMITS.CREATE_NOTE,
  createStreamDropHandler
);

