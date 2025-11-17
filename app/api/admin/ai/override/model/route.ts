import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { setModelOverride } from "@/lib/admin/ai/overrides";
import type { ModelTier } from "@/lib/ai/provider";

/**
 * POST /api/admin/ai/override/model
 * 
 * Auth: Admin only
 * Body: { tier: ModelTier, modelId: string }
 * Response: Created override
 * Side effects: Updates in-memory AI provider overrides
 */
export async function POST(req: Request) {
  try {
    // Require admin authentication
    const admin = await requireAdmin();

    const { tier, modelId } = await req.json();

    if (!tier || !modelId) {
      return NextResponse.json(
        { error: "tier and modelId are required" },
        { status: 400 }
      );
    }

    const override = await setModelOverride({
      tier: tier as ModelTier,
      modelId,
      adminUserId: admin.id,
    });

    return NextResponse.json({ override });
  } catch (error) {
    console.error("[admin/ai/override/model] Error:", error);

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

