import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { buildSmartStacks } from "@/lib/ai/buildSmartStacks"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    const stacks = await buildSmartStacks(user.id)

    return NextResponse.json(stacks)
  } catch (error) {
    console.error("[v0] List stacks error:", error)
    return NextResponse.json({ error: "Failed to list stacks" }, { status: 500 })
  }
}
