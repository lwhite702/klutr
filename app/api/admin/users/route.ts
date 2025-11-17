import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/admin/users
 * 
 * Auth: Admin only
 * Query params: summary?, activeLast7Days?, highCost?, search?
 * Response: List of users with stats
 */
export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const summary = searchParams.get("summary") === "true";
    const activeLast7Days = searchParams.get("activeLast7Days") === "true";
    const highCost = searchParams.get("highCost") === "true";
    const search = searchParams.get("search") || undefined;

    if (summary) {
      // Return summary stats
      const { data: users, error } = await supabaseAdmin
        .from("users")
        .select("id, created_at");

      if (error) throw error;

      // Count active users (users with notes created in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: activeUsers } = await supabaseAdmin
        .from("notes")
        .select("user_id")
        .gte("created_at", sevenDaysAgo.toISOString());

      const activeUserIds = new Set(activeUsers?.map((n) => n.user_id) || []);

      return NextResponse.json({
        totalUsers: users?.length || 0,
        activeUsersLast7Days: activeUserIds.size,
      });
    }

    // Get users with stats
    let query = supabaseAdmin.from("users").select("id, email, created_at, is_admin");

    if (search) {
      query = query.or(`email.ilike.%${search}%,id.ilike.%${search}%`);
    }

    const { data: users, error: usersError } = await query;

    if (usersError) throw usersError;

    // Get stats for each user
    const usersWithStats = await Promise.all(
      (users || []).map(async (user) => {
        // Get note count
        const { count: noteCount } = await supabaseAdmin
          .from("notes")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        // Get AI usage stats
        const { data: aiUsage } = await supabaseAdmin
          .from("ai_usage_logs")
          .select("estimated_cost")
          .eq("user_id", user.id);

        const totalCost = aiUsage?.reduce((sum, log) => sum + Number(log.estimated_cost), 0) || 0;
        const totalRequests = aiUsage?.length || 0;

        // Get last active (most recent note or AI request)
        const { data: lastNote } = await supabaseAdmin
          .from("notes")
          .select("created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        const { data: lastAI } = await supabaseAdmin
          .from("ai_usage_logs")
          .select("created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        const lastActive = lastNote?.created_at || lastAI?.created_at || null;

        return {
          ...user,
          total_notes: noteCount || 0,
          total_ai_requests: totalRequests,
          total_ai_cost: totalCost,
          last_active_at: lastActive,
        };
      })
    );

    // Apply filters
    let filtered = usersWithStats;
    if (activeLast7Days) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(
        (u) => u.last_active_at && new Date(u.last_active_at) >= sevenDaysAgo
      );
    }

    if (highCost) {
      filtered = filtered.filter((u) => u.total_ai_cost > 10); // $10 threshold
    }

    return NextResponse.json({ users: filtered });
  } catch (error) {
    console.error("[admin/users] Error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

