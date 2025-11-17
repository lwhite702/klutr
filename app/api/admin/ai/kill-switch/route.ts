import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getKillSwitchStatus,
  activateKillSwitch,
  deactivateKillSwitch,
} from "@/lib/admin/ai/features";

/**
 * GET /api/admin/ai/kill-switch
 *
 * Auth: Admin only
 * Response: Current kill switch status
 */
export async function GET() {
  try {
    await requireAdmin();

    const status = await getKillSwitchStatus();

    return NextResponse.json({ killSwitch: status });
  } catch (error) {
    console.error("[admin/ai/kill-switch] GET Error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/ai/kill-switch
 *
 * Auth: Admin only
 * Body: { enabled: boolean, reason?: string }
 * Response: Updated kill switch status
 * Side effects: Enables/disables ALL AI features globally
 */
export async function POST(req: Request) {
  try {
    // Require admin authentication
    const admin = await requireAdmin();

    const { enabled, reason } = await req.json();

    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "enabled (boolean) is required" },
        { status: 400 }
      );
    }

    let result;

    if (enabled) {
      if (!reason) {
        return NextResponse.json(
          { error: "reason is required when activating kill switch" },
          { status: 400 }
        );
      }
      result = await activateKillSwitch({ reason, adminUserId: admin.id });
    } else {
      result = await deactivateKillSwitch(admin.id);
    }

    return NextResponse.json({ killSwitch: result });
  } catch (error) {
    console.error("[admin/ai/kill-switch] POST Error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
