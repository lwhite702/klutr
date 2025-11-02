import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/supabaseDb"
import { toNoteDTO } from "@/lib/dto"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    const { searchParams } = new URL(req.url)
    const cluster = searchParams.get("cluster")

    if (!cluster) {
      return NextResponse.json({ error: "Cluster parameter is required" }, { status: 400 })
    }

    const notes = await db.note.findMany({
      where: {
        userId: user.id,
        cluster,
        archived: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      includeTags: true,
    })

    return NextResponse.json(notes.map(toNoteDTO))
  } catch (error) {
    console.error("[klutr] Stack detail error:", error)
    return NextResponse.json({ error: "Failed to get stack details" }, { status: 500 })
  }
}
