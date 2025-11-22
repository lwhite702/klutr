/**
 * PostHog Client-Side Integration
 * 
 * Provides singleton PostHog client instance for browser-side analytics and feature flags.
 * Initializes only on client-side to avoid SSR issues.
 */

import posthog from "posthog-js";

let posthogClient: typeof posthog | null = null;
let isInitialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Initialize PostHog client (singleton pattern)
 * Only initializes once, even if called multiple times
 */
export function initPostHog(): void {
  // Only initialize on client-side
  if (typeof window === "undefined") {
    return;
  }

  // Return if already initialized
  if (isInitialized && posthogClient) {
    return;
  }

  // If initialization is in progress, return the existing promise
  if (initPromise) {
    return;
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com";

  if (!apiKey) {
    console.warn("[PostHog] NEXT_PUBLIC_POSTHOG_KEY is not set. PostHog will not be initialized.");
    return;
  }

  // Initialize PostHog
  posthog.init(apiKey, {
    api_host: "/ingest", // Use Next.js rewrite proxy
    ui_host: apiHost,
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
    loaded: (posthog) => {
      posthogClient = posthog;
      isInitialized = true;
      
      // Set up feature flags ready callback
      posthog.onFeatureFlags(() => {
        if (process.env.NODE_ENV === "development") {
          console.log("[PostHog] Feature flags loaded");
        }
      });
    },
  });

  posthogClient = posthog;
}

/**
 * Get PostHog client instance
 * Returns null if not initialized or on server-side
 */
export function getPostHogClient(): typeof posthog | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!isInitialized) {
    initPostHog();
  }

  return posthogClient;
}

/**
 * Identify a user in PostHog
 * @param userId - User ID (typically Supabase user.id)
 * @param email - User email (optional)
 * @param properties - Additional user properties (optional)
 */
export function identifyUser(
  userId: string,
  email?: string,
  properties?: Record<string, any>
): void {
  const client = getPostHogClient();
  if (!client) {
    return;
  }

  client.identify(userId, {
    email,
    ...properties,
  });
}

/**
 * Reset user identification (call on logout)
 */
export function resetUser(): void {
  const client = getPostHogClient();
  if (!client) {
    return;
  }

  client.reset();
}

/**
 * Check if a feature flag is enabled
 * Waits for PostHog to be ready before checking flags
 * @param flag - Feature flag key
 * @returns Promise that resolves to true if flag is enabled, false otherwise
 */
export async function isFeatureEnabled(flag: string): Promise<boolean> {
  const client = getPostHogClient();
  if (!client) {
    return false;
  }

  // Wait for PostHog to be ready
  return new Promise((resolve) => {
    // Use onFeatureFlags callback to ensure flags are loaded
    client!.onFeatureFlags(() => {
      const enabled = client!.isFeatureEnabled(flag);
      resolve(enabled ?? false);
    });
  });
}

/**
 * Get feature flag value (for multivariate flags)
 * @param flag - Feature flag key
 * @returns Promise that resolves to the flag value or null
 */
export async function getFeatureFlag(flag: string): Promise<string | boolean | null> {
  const client = getPostHogClient();
  if (!client) {
    return null;
  }

  return new Promise((resolve) => {
    client!.onFeatureFlags(() => {
      const value = client!.getFeatureFlag(flag);
      resolve(value ?? null);
    });
  });
}

/**
 * Get feature flag payload (for JSON payloads)
 * @param flag - Feature flag key
 * @returns Promise that resolves to the flag payload or null
 */
export async function getFeatureFlagPayload(flag: string): Promise<any> {
  const client = getPostHogClient();
  if (!client) {
    return null;
  }

  return new Promise((resolve) => {
    client!.onFeatureFlags(() => {
      const payload = client!.getFeatureFlagPayload(flag);
      resolve(payload ?? null);
    });
  });
}

/**
 * Reload feature flags from PostHog
 * Useful after user identification or when flags need to be refreshed
 * @returns Promise that resolves when flags are reloaded
 */
export async function reloadFeatureFlags(): Promise<void> {
  const client = getPostHogClient();
  if (!client) {
    return;
  }

  return new Promise((resolve) => {
    client!.onFeatureFlags(() => {
      resolve();
    });
    client!.reloadFeatureFlags();
  });
}

/**
 * Capture an event in PostHog
 * @param eventName - Event name
 * @param properties - Event properties (optional)
 */
export function captureEvent(eventName: string, properties?: Record<string, any>): void {
  const client = getPostHogClient();
  if (!client) {
    return;
  }

  client.capture(eventName, properties);
}

/**
 * Capture an event only when a PostHog feature flag is enabled.
 * Falls back to development-only logging when flags are disabled.
 */
export async function captureFlaggedEvent(
  eventName: string,
  properties?: Record<string, any>,
  flagKey = "ux_stability_events"
): Promise<void> {
  const client = getPostHogClient();
  if (!client) {
    return;
  }

  try {
    const enabled = await isFeatureEnabled(flagKey);

    if (enabled || process.env.NODE_ENV === "development") {
      client.capture(eventName, {
        ...properties,
        flagKey,
        flagEnabled: enabled,
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[PostHog] Failed to send flagged event ${eventName}:`, error);
    }
  }
}

