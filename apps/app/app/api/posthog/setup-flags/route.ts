import { NextResponse } from "next/server";
import { createDefaultFeatureFlags } from "@/lib/posthog/api";
import { createDefaultFeatureFlagsViaMCP } from "@/lib/posthog/mcp";

/**
 * API Route to create default feature flags in PostHog
 * 
 * POST /api/posthog/setup-flags
 * 
 * Creates all default feature flags defined in FEATURE_FLAGS if they don't exist.
 * Requires POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID environment variables.
 * 
 * This endpoint attempts to use MCP server if available, otherwise falls back to REST API.
 * 
 * Query parameters:
 * - ?useMCP=true - Force use of MCP server (if available)
 * - ?useAPI=true - Force use of REST API (default fallback)
 * 
 * This is a one-time setup endpoint. You can call it after deploying to create
 * all the feature flags programmatically.
 */
export async function POST(request: Request) {
  try {
    // Optional: Add authentication/authorization here
    // For now, this is open - you may want to add a secret check
    
    const url = new URL(request.url);
    const useMCP = url.searchParams.get("useMCP") === "true";
    
    if (useMCP) {
      await createDefaultFeatureFlagsViaMCP();
    } else {
      await createDefaultFeatureFlags();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Feature flags created successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PostHog Setup] Error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

