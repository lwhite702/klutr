import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/admin/system/logs
 * 
 * Auth: Admin only
 * Query params: limit?, errorsOnly?
 * Response: Application-level error logs
 * 
 * Note: This currently returns AI error logs. In the future,
 * this could integrate with Rollbar, Sentry, or other logging services.
 */
export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 100;
    const errorsOnly = searchParams.get("errorsOnly") === "true";

    // Get AI error logs (as a proxy for system errors)
    const { data: errorLogs, error } = await supabaseAdmin
      .from("ai_error_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Format logs for display
    const logs = (errorLogs || []).map((log) => ({
      id: log.id,
      timestamp: log.created_at,
      level: "error",
      service: "ai",
      feature: log.feature,
      message: log.error_message,
      metadata: {
        user_id: log.user_id,
        model: log.model,
        provider: log.provider,
        tier: log.tier,
      },
    }));

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("[admin/system/logs] Error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

