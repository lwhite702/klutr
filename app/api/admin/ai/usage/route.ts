import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getAIUsage, getAIUsageSummary } from "@/lib/admin/ai/usage";

/**
 * GET /api/admin/ai/usage
 * 
 * Auth: Admin only
 * Query params: feature?, userId?, startDate?, endDate?, model?, provider?, limit?, summary?
 * Response: AI usage logs or summary
 */
export async function GET(req: Request) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { searchParams } = new URL(req.url);

    const feature = searchParams.get("feature") || undefined;
    const userId = searchParams.get("userId") || undefined;
    const model = searchParams.get("model") || undefined;
    const provider = searchParams.get("provider") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const summary = searchParams.get("summary") === "true";

    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined;
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined;

    if (summary) {
      const data = await getAIUsageSummary({
        feature,
        userId,
        model,
        provider,
        startDate,
        endDate,
      });

      return NextResponse.json({ summary: data });
    }

    const logs = await getAIUsage({
      feature,
      userId,
      model,
      provider,
      startDate,
      endDate,
      limit,
    });

    return NextResponse.json({ logs, count: logs.length });
  } catch (error) {
    console.error("[admin/ai/usage] Error:", error);

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

