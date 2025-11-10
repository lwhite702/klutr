import { NextResponse } from "next/server";
import { prisma, isDatabaseAvailable } from "@/lib/db";

/**
 * Deployment Health Check Endpoint
 * 
 * Returns runtime diagnostics for the deployed application:
 * - Database connectivity status
 * - Feature flags availability
 * - Environment configuration status
 * 
 * Auth: Public (but can be gated behind admin secret if needed)
 * Response: { status: "ok" | "degraded", database: {...}, featureFlags: {...}, timestamp: string }
 * Side effects: None (read-only diagnostics)
 */
export async function GET() {
  const diagnostics: {
    status: "ok" | "degraded";
    timestamp: string;
    database: {
      connected: boolean;
      available: boolean;
      error?: string;
    };
    featureFlags: {
      available: boolean;
      posthogConfigured: boolean;
      error?: string;
    };
    environment: {
      nodeEnv: string;
      hasOpenAI: boolean;
      hasSupabase: boolean;
      hasCronSecret: boolean;
    };
  } = {
    status: "ok",
    timestamp: new Date().toISOString(),
    database: {
      connected: false,
      available: false,
    },
    featureFlags: {
      available: false,
      posthogConfigured: false,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || "development",
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasSupabase: !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasCronSecret: !!process.env.CRON_SECRET,
    },
  };

  // Check database connectivity
  try {
    diagnostics.database.available = isDatabaseAvailable();
    
    if (diagnostics.database.available) {
      // Try a simple query to verify connection
      await prisma.$queryRaw`SELECT 1 as test`;
      diagnostics.database.connected = true;
    } else {
      diagnostics.database.error = "Database adapter not available";
      diagnostics.status = "degraded";
    }
  } catch (error) {
    diagnostics.database.connected = false;
    diagnostics.database.error = error instanceof Error ? error.message : "Unknown error";
    diagnostics.status = "degraded";
  }

  // Check feature flags availability
  try {
    const hasPostHogServer = !!process.env.POSTHOG_SERVER_KEY;
    const hasPostHogClient = !!process.env.NEXT_PUBLIC_POSTHOG_KEY;
    
    diagnostics.featureFlags.posthogConfigured = hasPostHogServer || hasPostHogClient;
    diagnostics.featureFlags.available = diagnostics.featureFlags.posthogConfigured;
    
    if (!diagnostics.featureFlags.available) {
      diagnostics.featureFlags.error = "PostHog not configured";
      // Don't mark as degraded - feature flags are optional
    }
  } catch (error) {
    diagnostics.featureFlags.available = false;
    diagnostics.featureFlags.error = error instanceof Error ? error.message : "Unknown error";
    // Don't mark as degraded - feature flags are optional
  }

  // Determine overall status
  if (!diagnostics.database.connected) {
    diagnostics.status = "degraded";
  }

  const statusCode = diagnostics.status === "ok" ? 200 : 503;
  
  return NextResponse.json(diagnostics, { status: statusCode });
}
