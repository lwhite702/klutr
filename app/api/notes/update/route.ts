import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/supabaseDb"
import { toNoteDTO } from "@/lib/dto"
import { classifyNoteContent } from "@/lib/ai/classifyNote"
import { embedNoteContent } from "@/lib/ai/embedNote"

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    const body = await req.json()
    const { id, content, type, archived, tagIds } = body

    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 })
    }

    // Verify note belongs to user
    const existingNote = await db.note.findUnique({
      where: { id },
    })

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    if (existingNote.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const contentChanged = content && content !== existingNote.content

    // Update the note
    const updateData: any = {}
    if (content !== undefined) updateData.content = content
    if (type !== undefined) updateData.type = type
    if (archived !== undefined) updateData.archived = archived

    const updatedNote = await db.note.update({
      where: { id },
      data: updateData,
    })

    // If content changed, re-classify and re-embed in background
    if (contentChanged) {
      Promise.all([
        (async () => {
          try {
            const classification = await classifyNoteContent(content)

            // Clear existing tags and add new ones
            await db.noteTag.deleteForNote(id)

            const tagRecords = await Promise.all(
              classification.tags.map((tagName) =>
                db.tag.upsert({
                  userId: user.id,
                  name: tagName,
                }),
              ),
            )

            // Link new tags
            await Promise.all(
              tagRecords.map((tag) => db.noteTag.create(id, tag.id))
            )

            await db.note.update({
              where: { id },
              data: {
                type: classification.type,
              },
            })
          } catch (error) {
            console.error("[v0] Re-classification failed:", error)
          }
        })(),
        (async () => {
          try {
            const embedding = await embedNoteContent(content)
            await db.note.updateEmbedding(id, embedding)
          } catch (error) {
            console.error("[klutr] Re-embedding failed:", error)
          }
        })(),
      ]).catch((err) => console.error("[klutr] Background re-processing error:", err))
    }

    // Fetch updated note with tags
    const noteWithTags = await db.note.findUnique({
      where: { id },
      includeTags: true,
    })

    return NextResponse.json(toNoteDTO(noteWithTags))
  } catch (error) {
    console.error("[klutr] Update note error:", error)
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
  }
}
