import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getAIFeatures } from "@/lib/admin/ai/features";

/**
 * GET /api/admin/ai/features
 * 
 * Auth: Admin only
 * Response: All AI feature flags
 */
export async function GET() {
  try {
    // Require admin authentication
    await requireAdmin();

    const features = await getAIFeatures();

    return NextResponse.json({ features });
  } catch (error) {
    console.error("[admin/ai/features] Error:", error);

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

