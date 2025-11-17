import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { toggleAIFeature } from "@/lib/admin/ai/features";

/**
 * POST /api/admin/ai/toggle/feature
 * 
 * Auth: Admin only
 * Body: { feature: string, enabled: boolean }
 * Response: Updated feature flag
 * Side effects: Enables/disables AI feature globally
 */
export async function POST(req: Request) {
  try {
    // Require admin authentication
    const admin = await requireAdmin();

    const { feature, enabled } = await req.json();

    if (!feature || typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "feature (string) and enabled (boolean) are required" },
        { status: 400 }
      );
    }

    const featureFlag = await toggleAIFeature({
      featureName: feature,
      enabled,
      adminUserId: admin.id,
    });

    return NextResponse.json({ feature: featureFlag });
  } catch (error) {
    console.error("[admin/ai/toggle/feature] Error:", error);

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

