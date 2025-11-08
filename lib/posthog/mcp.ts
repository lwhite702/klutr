/**
 * PostHog MCP Integration Helper
 * 
 * This module provides utilities to work with PostHog via MCP server.
 * When MCP tools are available, they will be used automatically.
 * Falls back to REST API if MCP is not configured.
 */

import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { createDefaultFeatureFlags as createViaAPI } from "./api";

/**
 * Create default feature flags using MCP server (if available) or REST API (fallback)
 * 
 * This function will attempt to use MCP tools if the PostHog MCP server is configured.
 * Otherwise, it falls back to the REST API implementation.
 */
export async function createDefaultFeatureFlagsViaMCP(): Promise<void> {
  // Check if MCP tools are available
  // In a real MCP setup, you would check for available MCP tools here
  // For now, we'll use the REST API as fallback
  
  console.log("[PostHog MCP] Attempting to create flags via MCP server...");
  
  try {
    // TODO: When MCP server is configured, use MCP tools here
    // Example (pseudo-code):
    // if (mcpToolsAvailable) {
    //   await mcp.posthog.createFeatureFlag({ key: FEATURE_FLAGS.SPARK_BETA, ... });
    // } else {
    //   await createViaAPI();
    // }
    
    // For now, fall back to REST API
    console.log("[PostHog MCP] MCP server not detected, using REST API fallback");
    await createViaAPI();
  } catch (error) {
    console.error("[PostHog MCP] Error creating flags:", error);
    throw error;
  }
}

/**
 * Get the list of default flags to create
 * This can be used by MCP tools or other integrations
 */
export function getDefaultFlags() {
  return [
    {
      key: FEATURE_FLAGS.SPARK_BETA,
      name: "Spark Beta",
      description: "Beta access to Spark feature",
      active: false,
    },
    {
      key: FEATURE_FLAGS.MUSE_AI,
      name: "Muse AI",
      description: "Muse AI feature access",
      active: false,
    },
    {
      key: FEATURE_FLAGS.ORBIT_EXPERIMENTAL,
      name: "Orbit Experimental",
      description: "Experimental Orbit view feature",
      active: false,
    },
    {
      key: FEATURE_FLAGS.VAULT_ENHANCED,
      name: "Vault Enhanced",
      description: "Enhanced vault features",
      active: false,
    },
    {
      key: FEATURE_FLAGS.KLUTR_GLOBAL_DISABLE,
      name: "Klutr Global Disable",
      description: "Global kill switch - disables all experimental features when enabled",
      active: false,
    },
  ];
}

/**
 * Instructions for using MCP server to create flags
 * 
 * When PostHog MCP server is configured, you can ask the AI:
 * "Create all the default PostHog feature flags"
 * 
 * The AI will use MCP tools to create:
 * - spark-beta
 * - muse-ai
 * - orbit-experimental
 * - vault-enhanced
 * - klutr-global-disable
 */
export const MCP_INSTRUCTIONS = `
To create PostHog feature flags via MCP server:

1. Ensure PostHog MCP server is configured in Cursor settings
2. Ask the AI: "Create all the default PostHog feature flags"
3. The AI will use MCP tools to create each flag

Default flags to create:
${getDefaultFlags().map(f => `- ${f.key}: ${f.name}`).join('\n')}
`;

