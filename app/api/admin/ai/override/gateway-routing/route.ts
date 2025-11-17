import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { setRoutingOverride } from "@/lib/admin/ai/overrides";

/**
 * POST /api/admin/ai/override/gateway-routing
 * 
 * Auth: Admin only
 * Body: { providerOrder: string[] }
 * Response: Created routing override
 * Side effects: Updates in-memory AI gateway routing
 */
export async function POST(req: Request) {
  try {
    // Require admin authentication
    const admin = await requireAdmin();

    const { providerOrder } = await req.json();

    if (!providerOrder || !Array.isArray(providerOrder)) {
      return NextResponse.json(
        { error: "providerOrder array is required" },
        { status: 400 }
      );
    }

    const override = await setRoutingOverride({
      providerOrder,
      adminUserId: admin.id,
    });

    return NextResponse.json({ override });
  } catch (error) {
    console.error("[admin/ai/override/gateway-routing] Error:", error);

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

