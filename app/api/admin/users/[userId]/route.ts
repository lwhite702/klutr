import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/admin/users/[userId]
 * 
 * Auth: Admin only
 * Response: User details with stats and recent AI interactions
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdmin();

    const { userId } = await params;

    // Get user
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get stats
    const { count: noteCount } = await supabaseAdmin
      .from("notes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    const { data: aiUsage } = await supabaseAdmin
      .from("ai_usage_logs")
      .select("estimated_cost")
      .eq("user_id", userId);

    const totalCost = aiUsage?.reduce((sum, log) => sum + Number(log.estimated_cost), 0) || 0;
    const totalRequests = aiUsage?.length || 0;

    // Get last active
    const { data: lastNote } = await supabaseAdmin
      .from("notes")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Get recent AI interactions
    const { data: recentAI } = await supabaseAdmin
      .from("ai_usage_logs")
      .select("id, feature, model, estimated_cost, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    return NextResponse.json({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_active_at: lastNote?.created_at || null,
      is_admin: user.is_admin || false,
      total_notes: noteCount || 0,
      total_ai_requests: totalRequests,
      total_ai_cost: totalCost,
      recent_ai_interactions: (recentAI || []).map((log) => ({
        id: log.id,
        feature: log.feature,
        model: log.model,
        cost: Number(log.estimated_cost),
        created_at: log.created_at,
      })),
    });
  } catch (error) {
    console.error("[admin/users/[userId]] Error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

