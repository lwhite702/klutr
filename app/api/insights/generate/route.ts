import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { generateWeeklyInsights } from "@/lib/ai/generateWeeklyInsights"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    await generateWeeklyInsights(user.id)

    // Fetch the latest insight
    const latestInsight = await prisma.weeklyInsight.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        weekStart: "desc",
      },
    })

    if (!latestInsight) {
      return NextResponse.json({ error: "No insights generated" }, { status: 404 })
    }

    return NextResponse.json({
      id: latestInsight.id,
      weekStart: latestInsight.weekStart.toISOString(),
      summary: latestInsight.summary,
      sentiment: latestInsight.sentiment,
      noteCount: latestInsight.noteCount,
      createdAt: latestInsight.createdAt.toISOString(),
    })
  } catch (error) {
    console.error("[v0] Generate insights error:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
