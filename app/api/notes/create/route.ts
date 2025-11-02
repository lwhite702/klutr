import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, isDatabaseAvailable } from "@/lib/supabaseDb";
import { toNoteDTO } from "@/lib/dto";
import { classifyNoteContent } from "@/lib/ai/classifyNote";
import { embedNoteContent } from "@/lib/ai/embedNote";
import {
  withValidationAndRateLimit,
  createErrorResponse,
  createSuccessResponse,
  RATE_LIMITS,
} from "@/lib/validation/middleware";
import { CreateNoteSchema, NoteDTOSchema } from "@/lib/validation/schemas";

async function createNoteHandler(req: NextRequest, data: any) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse(
        "Database not available. Please check configuration.",
        503
      );
    }

    const user = await getCurrentUser(req);
    const { content, type } = data;

    // Create the note first
    const note = await db.note.create({
      userId: user.id,
      content,
      type: type || "misc",
    });

    // Classify and embed in background (fire-and-forget for better UX)
    Promise.all([
      (async () => {
        try {
          const classification = await classifyNoteContent(content);

          // Upsert tags
          const tagRecords = await Promise.all(
            classification.tags.map((tagName) =>
              db.tag.upsert({
                userId: user.id,
                name: tagName,
              })
            )
          );

          // Link tags to note
          await Promise.all(
            tagRecords.map((tag) =>
              db.noteTag.create(note.id, tag.id)
            )
          );

          // Update note with classification
          await db.note.update({
            where: { id: note.id },
            data: {
              type: classification.type,
            },
          });
        } catch (error) {
          console.error("[klutr] Classification failed:", error);
        }
      })(),
      (async () => {
        try {
          const embedding = await embedNoteContent(content);

          // Store embedding
          await db.note.updateEmbedding(note.id, embedding);
        } catch (error) {
          console.error("[klutr] Embedding failed:", error);
        }
      })(),
    ]).catch((err) => console.error("[klutr] Background processing error:", err));

    // Fetch note with tags for response
    const noteWithTags = await db.note.findUnique({
      where: { id: note.id },
      includeTags: true,
    });

    // Validate response before sending
    const noteDTO = toNoteDTO(noteWithTags);
    const validation = NoteDTOSchema.safeParse(noteDTO);

    if (!validation.success) {
      console.error("Response validation failed:", validation.error);
      return createErrorResponse("Invalid response format", 500);
    }

    return createSuccessResponse(validation.data, NoteDTOSchema);
  } catch (error) {
    console.error("[klutr] Create note error:", error);
    return createErrorResponse("Failed to create note", 500);
  }
}

export const POST = withValidationAndRateLimit(
  CreateNoteSchema,
  RATE_LIMITS.CREATE_NOTE,
  createNoteHandler
);
