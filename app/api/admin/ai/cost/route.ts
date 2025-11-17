import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getAIUsageSummary, getAICostByPeriod } from "@/lib/admin/ai/usage";

/**
 * GET /api/admin/ai/cost
 * 
 * Auth: Admin only
 * Query params: period?, startDate?, endDate?
 * Response: AI cost breakdown and trends
 */
export async function GET(req: Request) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { searchParams } = new URL(req.url);

    const periodType = (searchParams.get("period") ||
      "daily") as "hourly" | "daily" | "weekly" | "monthly";

    // Default to last 30 days
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : new Date();

    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [summary, costHistory] = await Promise.all([
      getAIUsageSummary({ startDate, endDate }),
      getAICostByPeriod(periodType, startDate, endDate),
    ]);

    return NextResponse.json({
      summary,
      history: costHistory,
      period: { type: periodType, start: startDate, end: endDate },
    });
  } catch (error) {
    console.error("[admin/ai/cost] Error:", error);

    if (
      error instanceof Error &&
      error.message.includes("Unauthorized")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

