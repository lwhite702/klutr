import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db, isDatabaseAvailable } from "@/lib/supabaseDb"
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
    const note = await db.note.findUnique({
      where: { id },
    })

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    if (note.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Force re-classification
    const classification = await classifyNoteContent(note.content)

    // Clear existing tags
    await db.noteTag.deleteForNote(id)

    // Upsert new tags
    const tagRecords = await Promise.all(
      classification.tags.map((tagName) =>
        db.tag.upsert({
          userId: user.id,
          name: tagName,
        }),
      ),
    )

    // Link new tags to note
    await Promise.all(
      tagRecords.map((tag) => db.noteTag.create(id, tag.id))
    )

    // Update note with new classification
    await db.note.update({
      where: { id },
      data: {
        type: classification.type,
      },
    })

    // Fetch updated note with tags
    const updatedNote = await db.note.findUnique({
      where: { id },
      includeTags: true,
    })

    return NextResponse.json(toNoteDTO(updatedNote))
  } catch (error) {
    console.error("[klutr] Classify note error:", error)
    return NextResponse.json({ error: "Failed to classify note" }, { status: 500 })
  }
}
