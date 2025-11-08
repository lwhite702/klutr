#!/usr/bin/env tsx
/**
 * Setup PostHog Feature Flags Script
 * 
 * Creates all default feature flags in PostHog if they don't exist.
 * 
 * Usage:
 *   pnpm tsx scripts/setup-posthog-flags.ts
 * 
 * Requires:
 *   - POSTHOG_PERSONAL_API_KEY (from PostHog → Settings → Personal API Keys)
 *   - POSTHOG_PROJECT_ID (from PostHog → Project Settings)
 *   - NEXT_PUBLIC_POSTHOG_HOST (optional, defaults to https://us.posthog.com)
 */

import { createDefaultFeatureFlags } from "@/lib/posthog/api";

async function main() {
  console.log("🚀 Setting up PostHog feature flags...\n");

  try {
    await createDefaultFeatureFlags();
    console.log("\n✅ Successfully set up PostHog feature flags!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed to set up feature flags:", error);
    if (error instanceof Error) {
      console.error("\nError details:", error.message);
    }
    process.exit(1);
  }
}

main();

