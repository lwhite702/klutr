import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    const vaultNotes = await prisma.vaultNote.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        createdAt: true,
        // Never return encryptedBlob - client will decrypt locally
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(
      vaultNotes.map((note) => ({
        id: note.id,
        createdAt: note.createdAt.toISOString(),
      })),
    )
  } catch (error) {
    console.error("[v0] List vault notes error:", error)
    return NextResponse.json({ error: "Failed to list vault notes" }, { status: 500 })
  }
}
