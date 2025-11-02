import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db, isDatabaseAvailable } from "@/lib/supabaseDb"
import { toNoteDTO } from "@/lib/dto"

export async function GET(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json([])
    }

    const user = await getCurrentUser(req)

    // Get notes that are either type=nope or archived
    const [nopeNotes, archivedNotes] = await Promise.all([
      db.note.findMany({
        where: {
          userId: user.id,
          type: "nope",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
        includeTags: true,
      }),
      db.note.findMany({
        where: {
          userId: user.id,
          archived: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
        includeTags: true,
      }),
    ])

    // Combine and deduplicate
    const noteMap = new Map()
    ;[...nopeNotes, ...archivedNotes].forEach(note => noteMap.set(note.id, note))
    const notes = Array.from(noteMap.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 100)

    return NextResponse.json(notes.map(toNoteDTO))
  } catch (error) {
    console.error("[klutr] List nope notes error:", error)
    return NextResponse.json([])
  }
}
