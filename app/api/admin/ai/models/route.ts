import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getAIModelCatalog, getAIModelStates } from "@/lib/admin/ai/models";

/**
 * GET /api/admin/ai/models
 * 
 * Auth: Admin only
 * Response: Available AI models and their states
 */
export async function GET() {
  try {
    // Require admin authentication
    await requireAdmin();

    const [catalog, states] = await Promise.all([
      getAIModelCatalog(),
      getAIModelStates(),
    ]);

    return NextResponse.json({
      catalog,
      states,
    });
  } catch (error) {
    console.error("[admin/ai/models] Error:", error);

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

