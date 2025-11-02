import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/supabaseDb"
import { toNoteDTO } from "@/lib/dto"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    const { searchParams } = new URL(req.url)
    const weekParam = searchParams.get("week")

    if (!weekParam) {
      return NextResponse.json({ error: "Week parameter is required (YYYY-MM-DD)" }, { status: 400 })
    }

    const weekStart = new Date(weekParam)
    if (isNaN(weekStart.getTime())) {
      return NextResponse.json({ error: "Invalid week date format" }, { status: 400 })
    }

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    const notes = await db.note.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: weekStart,
          lt: weekEnd,
        },
        archived: false,
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
    })

    return NextResponse.json(notes.map(toNoteDTO))
  } catch (error) {
    console.error("[klutr] Notes by week error:", error)
    return NextResponse.json({ error: "Failed to get notes by week" }, { status: 500 })
  }
}
