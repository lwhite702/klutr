import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { setTierOverride } from "@/lib/admin/ai/overrides";
import type { ModelTier } from "@/lib/ai/provider";

/**
 * POST /api/admin/ai/override/tier
 * 
 * Auth: Admin only
 * Body: { feature: string, tier: ModelTier }
 * Response: Created override
 * Side effects: Updates in-memory AI provider overrides
 */
export async function POST(req: Request) {
  try {
    // Require admin authentication
    const admin = await requireAdmin();

    const { feature, tier } = await req.json();

    if (!feature || !tier) {
      return NextResponse.json(
        { error: "feature and tier are required" },
        { status: 400 }
      );
    }

    const override = await setTierOverride({
      feature,
      tier: tier as ModelTier,
      adminUserId: admin.id,
    });

    return NextResponse.json({ override });
  } catch (error) {
    console.error("[admin/ai/override/tier] Error:", error);

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

