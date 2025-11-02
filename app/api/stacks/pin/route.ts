import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/supabaseDb"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req)
    const { id, pinned } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Stack ID is required" }, { status: 400 })
    }

    // Update the stack's pinned status
    await db.smartStack.updatePinned(id, pinned)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[klutr] Failed to pin stack:", error)
    return NextResponse.json({ error: "Failed to pin stack" }, { status: 500 })
  }
}
