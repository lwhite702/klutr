import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma, isDatabaseAvailable } from "@/lib/db"
import { toNoteDTO } from "@/lib/dto"
import { classifyNoteContent } from "@/lib/ai/classifyNote"

export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const user = await getCurrentUser(req)
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 })
    }

    // Verify note belongs to user
    const note = await prisma.note.findUnique({
      where: { id },
      select: { userId: true, content: true },
    })

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    if (note.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Force re-classification using Edge Function
    try {
      const { classifyNoteViaEdgeFunction } = await import("@/lib/edge-functions");
      const result = await classifyNoteViaEdgeFunction(id, note.content);
      
      // Get updated note with tags
      const updatedNote = await prisma.note.findUnique({
        where: { id },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (!updatedNote) {
        return NextResponse.json({ error: "Note not found after classification" }, { status: 404 });
      }

      return NextResponse.json(toNoteDTO(updatedNote));
    } catch (edgeFunctionError) {
      console.error("[v0] Edge Function classification failed, falling back to direct:", edgeFunctionError);
      
      // Fallback to direct classification
      const classification = await classifyNoteContent(note.content);

      // Clear existing tags
      await prisma.noteTag.deleteMany({
        where: { noteId: id },
      });

      // Upsert new tags
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

      // Update note with new classification and tags
      const updatedNote = await prisma.note.update({
        where: { id },
        data: {
          type: classification.type,
          tags: {
            create: tagRecords.map((tag) => ({
              tagId: tag.id,
            })),
          },
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return NextResponse.json(toNoteDTO(updatedNote));
    }
  } catch (error) {
    console.error("[v0] Classify note error:", error)
    return NextResponse.json({ error: "Failed to classify note" }, { status: 500 })
  }
}
