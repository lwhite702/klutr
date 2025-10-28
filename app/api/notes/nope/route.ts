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

    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
        OR: [{ type: "nope" }, { archived: true }],
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
    })

    return NextResponse.json(notes.map(toNoteDTO))
  } catch (error) {
    console.error("[v0] List nope notes error:", error)
    return NextResponse.json([])
  }
}
