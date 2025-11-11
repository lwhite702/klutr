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

    const notes = await prisma.note.findMany({
      where,
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
    })

    return NextResponse.json(notes.map(toNoteDTO))
  } catch (error) {
    console.error("[v0] List notes error:", error)
    return NextResponse.json([])
  }
}
