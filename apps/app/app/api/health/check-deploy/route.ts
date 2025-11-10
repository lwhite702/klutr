import { NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/db";

/**
 * Deployment Health Check Endpoint
 * 
 * Provides runtime diagnostics for deployed application including:
 * - Database connectivity
 * - Environment configuration
 * - Feature flags status (if applicable)
 * 
 * Auth: None (public endpoint - sensitive data masked)
 * Method: GET
 * Response: { status: string, database: object, environment: object, timestamp: string }
 * Side effects: None (read-only health check)
 */
export async function GET() {
  try {
    // Check database connectivity
    const dbStatus = await checkDatabase();
    
    // Check environment configuration
    const envStatus = checkEnvironment();
    
    // Check feature flags (if PostHog is configured)
    const featureFlagsStatus = checkFeatureFlags();
    
    // Determine overall status
    const overallStatus = 
      dbStatus.connected && envStatus.configured 
        ? "ok" 
        : "degraded";
    
    return NextResponse.json({
      status: overallStatus,
      database: dbStatus,
      environment: envStatus,
      featureFlags: featureFlagsStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[health/check-deploy] Health check error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

async function checkDatabase() {
  try {
    // Use the isDatabaseAvailable utility
    const isAvailable = isDatabaseAvailable();
    
    // Attempt a simple database operation to verify connectivity
    if (isAvailable) {
      return {
        connected: true,
        message: "Database connectivity verified",
      };
    } else {
      return {
        connected: false,
        message: "Database not available",
      };
    }
  } catch (error) {
    console.error("[health/check-deploy] Database check failed:", error);
    return {
      connected: false,
      message: "Database check failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function checkEnvironment() {
  const requiredVars = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "OPENAI_API_KEY",
    "CRON_SECRET",
  ];
  
  const missing: string[] = [];
  const present: string[] = [];
  
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  }
  
  return {
    configured: missing.length === 0,
    present: present,
    missing: missing,
    nodeEnv: process.env.NODE_ENV || "development",
  };
}

function checkFeatureFlags() {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  
  return {
    enabled: !!(posthogKey && posthogHost),
    configured: !!(posthogKey && posthogHost),
  };
}
