import { NextResponse } from "next/server"
import { isDatabaseAvailable } from "@/lib/db"
import { featureEnabled } from "@/lib/featureFlags"
import { FEATURE_FLAGS } from "@/lib/featureFlags.constants"

/**
 * Deployment Health Check Endpoint
 * 
 * Provides runtime diagnostics for the deployed application.
 * Checks database connectivity, feature flags, and critical service status.
 * 
 * Auth: None (public endpoint, but consider adding rate limiting)
 * Response: { status: "ok" | "degraded", dbConnected: boolean, featureFlagsLoaded: boolean, ... }
 * Side effects: None (read-only)
 */
export async function GET() {
  try {
    const checks: Record<string, boolean | string> = {}
    
    // Check database availability
    let dbConnected = false
    try {
      dbConnected = isDatabaseAvailable()
      if (dbConnected) {
        // Try a simple query to verify actual connectivity
        try {
          const { prisma } = await import("@/lib/db")
          await prisma.user.findMany({ take: 1 })
          checks.dbConnected = true
        } catch (prismaError) {
          // If Prisma fails, try Supabase directly
          const { supabaseAdmin } = await import("@/lib/supabase")
          const { error: supabaseError } = await supabaseAdmin
            .from("users")
            .select("id")
            .limit(1)
          if (supabaseError) throw supabaseError
          checks.dbConnected = true
        }
      } else {
        checks.dbConnected = false
      }
    } catch (error) {
      checks.dbConnected = false
      checks.dbError = error instanceof Error ? error.message : "Unknown error"
    }
    
    // Check feature flags (PostHog)
    let featureFlagsLoaded = false
    try {
      // Try to check a known feature flag
      await featureEnabled(FEATURE_FLAGS.KLUTR_GLOBAL_DISABLE, undefined, true)
      featureFlagsLoaded = true
      checks.featureFlagsLoaded = true
    } catch (error) {
      featureFlagsLoaded = false
      checks.featureFlagsLoaded = false
      checks.featureFlagsError = error instanceof Error ? error.message : "Unknown error"
    }
    
    // Check environment variables (without exposing values)
    checks.envVarsConfigured = !!(
      process.env.OPENAI_API_KEY &&
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.CRON_SECRET
    )
    
    // Determine overall status
    const allCritical = checks.dbConnected && checks.featureFlagsLoaded && checks.envVarsConfigured
    const status = allCritical ? "ok" : "degraded"
    
    return NextResponse.json({
      status,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      checks,
      dbConnected: checks.dbConnected === true,
      featureFlagsLoaded: checks.featureFlagsLoaded === true,
    })
  } catch (error) {
    console.error("[health/check-deploy] Error:", error)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
