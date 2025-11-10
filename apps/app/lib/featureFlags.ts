/**
 * Feature Flags Middleware
 * 
 * Provides centralized feature flag management with caching.
 * Supports both client-side and server-side flag checks.
 */

import { isFeatureEnabled as clientIsFeatureEnabled } from "./posthog/client";
import { getFeatureFlag as serverGetFeatureFlag } from "./posthog/server";

/**
 * Feature flag constants
 * Use these constants instead of string literals to avoid typos
 */
export const FEATURE_FLAGS = {
  SPARK_BETA: "spark-beta",
  MUSE_AI: "muse-ai",
  ORBIT_EXPERIMENTAL: "orbit-experimental",
  VAULT_ENHANCED: "vault-enhanced",
  KLUTR_GLOBAL_DISABLE: "klutr-global-disable", // Kill switch
  CHAT_INTERFACE: "chat-interface",
  FILE_DROPS: "file-drops",
  VOICE_CAPTURE: "voice-capture",
  SMART_THREADS: "smart-threads",
  EMBEDDINGS: "embeddings",
  CLASSIFICATION: "classification",
} as const;

export type FeatureFlag = typeof FEATURE_FLAGS[keyof typeof FEATURE_FLAGS];

/**
 * Cache entry for feature flags
 */
interface CacheEntry {
  value: boolean;
  timestamp: number;
}

/**
 * In-memory cache for feature flags
 * Key format: `flag:${flag}:${userId || 'anonymous'}`
 * TTL: 5 minutes (300000ms)
 */
const flagCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Check if a cached value is still valid
 */
function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_TTL;
}

/**
 * Get cache key for a flag and user
 */
function getCacheKey(flag: string, userId?: string): string {
  return `flag:${flag}:${userId || "anonymous"}`;
}

/**
 * Get cached flag value
 */
function getCachedValue(flag: string, userId?: string): boolean | null {
  const key = getCacheKey(flag, userId);
  const entry = flagCache.get(key);

  if (entry && isCacheValid(entry)) {
    return entry.value;
  }

  // Remove expired entry
  if (entry) {
    flagCache.delete(key);
  }

  return null;
}

/**
 * Set cached flag value
 */
function setCachedValue(flag: string, userId: string | undefined, value: boolean): void {
  const key = getCacheKey(flag, userId);
  flagCache.set(key, {
    value,
    timestamp: Date.now(),
  });
}

/**
 * Check if a feature flag is enabled
 * Uses caching to reduce PostHog API calls
 * 
 * @param flag - Feature flag key (use FEATURE_FLAGS constants)
 * @param userId - User ID for personalized flags (optional)
 * @param useServer - Force server-side check (default: auto-detect)
 * @returns Promise that resolves to true if flag is enabled, false otherwise
 */
export async function featureEnabled(
  flag: string,
  userId?: string,
  useServer?: boolean
): Promise<boolean> {
  // Check kill switch first (always check this flag)
  if (flag !== FEATURE_FLAGS.KLUTR_GLOBAL_DISABLE) {
    const killSwitchEnabled = await featureEnabled(
      FEATURE_FLAGS.KLUTR_GLOBAL_DISABLE,
      userId,
      useServer
    );
    if (killSwitchEnabled) {
      // Kill switch is enabled - disable all features
      return false;
    }
  }

  // Check cache first
  const cached = getCachedValue(flag, userId);
  if (cached !== null) {
    return cached;
  }

  // Determine if we should use server-side or client-side check
  const isServer = useServer ?? typeof window === "undefined";

  let enabled = false;

  try {
    if (isServer) {
      // Server-side check
      enabled = await serverGetFeatureFlag(flag, userId);
    } else {
      // Client-side check
      enabled = await clientIsFeatureEnabled(flag);
    }

    // Cache the result
    setCachedValue(flag, userId, enabled);

    // Log flag checks for experimental users (when flag returns true)
    if (enabled && userId) {
      console.log(`[Feature Flag] "${flag}" enabled for user: ${userId}`);
    }

    return enabled;
  } catch (error) {
    console.error(`[Feature Flag] Error checking flag "${flag}":`, error);
    // Fail closed: return false on error
    return false;
  }
}

/**
 * Clear the feature flag cache
 * Useful for testing or when flags need to be refreshed immediately
 */
export function clearFeatureFlagCache(): void {
  flagCache.clear();
}

/**
 * Clear cache for a specific flag and user
 */
export function clearFeatureFlagCacheFor(flag: string, userId?: string): void {
  const key = getCacheKey(flag, userId);
  flagCache.delete(key);
}

