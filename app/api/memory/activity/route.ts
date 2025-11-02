import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { analyzeTimeline } from "@/lib/ai/analyzeTimeline"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    const timeline = await analyzeTimeline(user.id)

    return NextResponse.json(timeline)
  } catch (error) {
    console.error("[klutr] Memory activity error:", error)
    return NextResponse.json({ error: "Failed to get memory activity" }, { status: 500 })
  }
}
