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
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const cluster = searchParams.get("cluster")

    const where: any = {
      userId: user.id,
    }

    if (type && type !== "all") {
      where.type = type
    }

    if (cluster && cluster !== "all") {
      where.cluster = cluster
    }

    const notes = await db.note.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
      includeTags: true,
    })

    return NextResponse.json(notes.map(toNoteDTO))
  } catch (error) {
    console.error("[klutr] List notes error:", error)
    return NextResponse.json([])
  }
}
