import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    const insights = await prisma.weeklyInsight.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        weekStart: "desc",
      },
      take: 12, // Last 12 weeks
    });

    return NextResponse.json(
      insights.map((insight: any) => ({
        id: insight.id,
        weekStart: insight.weekStart.toISOString(),
        summary: insight.summary,
        sentiment: insight.sentiment,
        noteCount: insight.noteCount,
        createdAt: insight.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error("[v0] List insights error:", error);
    return NextResponse.json(
      { error: "Failed to list insights" },
      { status: 500 }
    );
  }
}
