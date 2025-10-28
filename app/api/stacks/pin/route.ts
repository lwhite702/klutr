import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req)
    const { name, pinned } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Stack name is required" }, { status: 400 })
    }

    // Update or create the stack with pinned status
    const stack = await prisma.smartStack.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name,
        },
      },
      update: {
        pinned,
      },
      create: {
        userId: user.id,
        name,
        pinned,
        noteCount: 0,
        summary: "",
      },
    })

    return NextResponse.json({ ok: true, stack })
  } catch (error) {
    console.error("[v0] Failed to pin stack:", error)
    return NextResponse.json({ error: "Failed to pin stack" }, { status: 500 })
  }
}
