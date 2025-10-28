import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    const body = await req.json()
    const { encryptedBlob } = body

    if (!encryptedBlob || typeof encryptedBlob !== "string") {
      return NextResponse.json({ error: "Encrypted blob is required" }, { status: 400 })
    }

    const vaultNote = await prisma.vaultNote.create({
      data: {
        userId: user.id,
        encryptedBlob,
      },
    })

    return NextResponse.json({
      ok: true,
      id: vaultNote.id,
      createdAt: vaultNote.createdAt.toISOString(),
    })
  } catch (error) {
    console.error("[v0] Create vault note error:", error)
    return NextResponse.json({ error: "Failed to create vault note" }, { status: 500 })
  }
}
