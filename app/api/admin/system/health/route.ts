import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";

/**
 * GET /api/admin/system/health
 * 
 * Auth: Admin only
 * Response: System health checks
 */
export async function GET() {
  try {
    await requireAdmin();

    const checks = [];

    // Check required env vars
    const requiredEnvVars = [
      "DATABASE_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ];

    const missingEnvVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    checks.push({
      name: "Environment Variables",
      status: missingEnvVars.length === 0 ? "healthy" : "degraded",
      message:
        missingEnvVars.length === 0
          ? "All required environment variables are set"
          : `Missing: ${missingEnvVars.join(", ")}`,
    });

    // Check database connectivity
    try {
      const { supabaseAdmin } = await import("@/lib/supabase");
      const { error } = await supabaseAdmin.from("users").select("id").limit(1);

      checks.push({
        name: "Database",
        status: error ? "down" : "healthy",
        message: error ? `Database error: ${error.message}` : "Database connection successful",
      });
    } catch (err) {
      checks.push({
        name: "Database",
        status: "down",
        message: err instanceof Error ? err.message : "Database connection failed",
      });
    }

    // Check AI Gateway (if configured)
    if (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN) {
      checks.push({
        name: "AI Gateway",
        status: "healthy",
        message: "AI Gateway API key configured",
      });
    } else {
      checks.push({
        name: "AI Gateway",
        status: "degraded",
        message: "AI Gateway not configured (using direct provider access)",
      });
    }

    return NextResponse.json({ checks });
  } catch (error) {
    console.error("[admin/system/health] Error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

