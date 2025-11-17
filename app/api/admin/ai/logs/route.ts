import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getAIErrors } from "@/lib/admin/ai/usage";

/**
 * GET /api/admin/ai/logs
 * 
 * Auth: Admin only
 * Query params: feature?, userId?, startDate?, endDate?, limit?
 * Response: AI error logs
 */
export async function GET(req: Request) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { searchParams } = new URL(req.url);

    const feature = searchParams.get("feature") || undefined;
    const userId = searchParams.get("userId") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 100;

    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined;
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined;

    const errors = await getAIErrors({
      feature,
      userId,
      startDate,
      endDate,
      limit,
    });

    return NextResponse.json({ errors, count: errors.length });
  } catch (error) {
    console.error("[admin/ai/logs] Error:", error);

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

