import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/admin/notes
 * 
 * Auth: Admin only
 * Query params: summary?, days?
 * Response: Note statistics
 */
export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const summary = searchParams.get("summary") === "true";
    const days = searchParams.get("days") ? parseInt(searchParams.get("days")!) : 7;

    if (summary) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { count, error } = await supabaseAdmin
        .from("notes")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startDate.toISOString());

      if (error) throw error;

      return NextResponse.json({ count: count || 0 });
    }

    return NextResponse.json({ error: "Not implemented" }, { status: 501 });
  } catch (error) {
    console.error("[admin/notes] Error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

