import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma, isDatabaseAvailable } from "@/lib/db"
import { toNoteDTO } from "@/lib/dto"

export async function GET(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json([])
    }

    const user = await getCurrentUser(req)

    // Fetch notes with type "nope" OR archived notes
    // Since Supabase doesn't support OR directly in the adapter, we'll use two queries
    const [nopeNotes, archivedNotes] = await Promise.all([
      prisma.note.findMany({
        where: {
          userId: user.id,
          type: "nope",
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      }),
      prisma.note.findMany({
        where: {
          userId: user.id,
          archived: true,
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      }),
    ])

    // Combine and deduplicate by ID
    const noteMap = new Map()
    for (const note of nopeNotes) {
      noteMap.set(note.id, note)
    }
    for (const note of archivedNotes) {
      if (!noteMap.has(note.id)) {
        noteMap.set(note.id, note)
      }
    }
    const notes = Array.from(noteMap.values()).slice(0, 100)

    return NextResponse.json(notes.map(toNoteDTO))
  } catch (error) {
    console.error("[v0] List nope notes error:", error)
    return NextResponse.json([])
  }
}
