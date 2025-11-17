/**
 * AI Engine Initialization
 * 
 * Loads admin overrides and feature flags on server startup
 */

import { loadOverridesIntoMemory } from "./overrides";
import { loadFeatureFlagsIntoMemory } from "./features";

/**
 * Initialize AI Engine admin system
 * Call this on server startup to load overrides from database
 */
export async function initializeAIEngine() {
  console.log("[AI Engine] Initializing admin controls...");

  try {
    // Load overrides and feature flags in parallel
    await Promise.all([loadOverridesIntoMemory(), loadFeatureFlagsIntoMemory()]);

    console.log("[AI Engine] Admin controls initialized successfully");
  } catch (error) {
    console.error("[AI Engine] Failed to initialize admin controls:", error);
    console.warn("[AI Engine] Continuing with default configuration");
  }
}

