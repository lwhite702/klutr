/**
 * Client-Only Feature Flags
 *
 * This is a client-only version that doesn't import server-side code.
 * Use this in client components to avoid bundling server-only dependencies.
 */

import { isFeatureEnabled as clientIsFeatureEnabled } from "./posthog/client";
import { FEATURE_FLAGS } from "./featureFlags.constants";

/**
 * Cache entry for feature flags
 */
interface CacheEntry {
  value: boolean;
  timestamp: number;
}

/**
 * In-memory cache for feature flags
 */
const flagCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_TTL;
}

function getCacheKey(flag: string, userId?: string): string {
  return `flag:${flag}:${userId || "anonymous"}`;
}

function getCachedValue(flag: string, userId?: string): boolean | null {
  const key = getCacheKey(flag, userId);
  const entry = flagCache.get(key);

  if (entry && isCacheValid(entry)) {
    return entry.value;
  }

  if (entry) {
    flagCache.delete(key);
  }

  return null;
}

function setCachedValue(
  flag: string,
  userId: string | undefined,
  value: boolean
): void {
  const key = getCacheKey(flag, userId);
  flagCache.set(key, {
    value,
    timestamp: Date.now(),
  });
}

/**
 * Check if a feature flag is enabled (client-only)
 * This version only uses client-side PostHog and never imports server code.
 */
export async function featureEnabledClient(
  flag: string,
  userId?: string
): Promise<boolean> {
  // Check kill switch first
  if (flag !== FEATURE_FLAGS.KLUTR_GLOBAL_DISABLE) {
    const killSwitchEnabled = await featureEnabledClient(
      FEATURE_FLAGS.KLUTR_GLOBAL_DISABLE,
      userId
    );
    if (killSwitchEnabled) {
      return false;
    }
  }

  // Check cache first
  const cached = getCachedValue(flag, userId);
  if (cached !== null) {
    return cached;
  }

  let enabled = false;

  try {
    // Always use client-side check
    enabled = await clientIsFeatureEnabled(flag);

    // Cache the result
    setCachedValue(flag, userId, enabled);

    if (enabled && userId) {
      console.log(`[Feature Flag] "${flag}" enabled for user: ${userId}`);
    }

    return enabled;
  } catch (error) {
    console.error(`[Feature Flag] Error checking flag "${flag}":`, error);
    return false;
  }
}
