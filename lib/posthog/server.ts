/**
 * PostHog Server-Side Integration
 * 
 * Provides PostHog Node client for server-side feature flag checks.
 * Used in API routes, server components, and background jobs.
 */

import { PostHog } from "posthog-node";

let posthogServer: PostHog | null = null;

/**
 * Get or initialize PostHog server client (singleton pattern)
 * @returns PostHog client instance or null if not configured
 */
function getPostHogServer(): PostHog | null {
  // Return existing instance if already initialized
  if (posthogServer) {
    return posthogServer;
  }

  const apiKey = process.env.POSTHOG_SERVER_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com";

  if (!apiKey) {
    console.warn("[PostHog Server] POSTHOG_SERVER_KEY is not set. Server-side feature flags will be disabled.");
    return null;
  }

  try {
    posthogServer = new PostHog(apiKey, {
      host,
      flushAt: 20, // Flush after 20 events
      flushInterval: 10000, // Flush every 10 seconds
    });

    return posthogServer;
  } catch (error) {
    console.error("[PostHog Server] Failed to initialize:", error);
    return null;
  }
}

/**
 * Check if a feature flag is enabled for a user
 * @param flag - Feature flag key
 * @param distinctId - User distinct ID (typically user.id or email)
 * @param properties - Additional user properties for flag evaluation (optional)
 * @returns Promise that resolves to true if flag is enabled, false otherwise
 */
export async function getFeatureFlag(
  flag: string,
  distinctId?: string,
  properties?: Record<string, any>
): Promise<boolean> {
  const client = getPostHogServer();
  if (!client) {
    // Fail closed: return false if PostHog is not configured
    return false;
  }

  try {
    // Use a default distinct ID if none provided
    const userId = distinctId || "anonymous";

    const isEnabled = await client.isFeatureEnabled(flag, userId, properties);
    return isEnabled ?? false;
  } catch (error) {
    console.error(`[PostHog Server] Error checking feature flag "${flag}":`, error);
    // Fail closed: return false on error
    return false;
  }
}

/**
 * Get feature flag value (for multivariate flags)
 * @param flag - Feature flag key
 * @param distinctId - User distinct ID (typically user.id or email)
 * @param properties - Additional user properties for flag evaluation (optional)
 * @returns Promise that resolves to the flag value or null
 */
export async function getFeatureFlagValue(
  flag: string,
  distinctId?: string,
  properties?: Record<string, any>
): Promise<string | boolean | null> {
  const client = getPostHogServer();
  if (!client) {
    return null;
  }

  try {
    const userId = distinctId || "anonymous";
    const value = await client.getFeatureFlag(flag, userId, properties);
    return value ?? null;
  } catch (error) {
    console.error(`[PostHog Server] Error getting feature flag value "${flag}":`, error);
    return null;
  }
}

/**
 * Get feature flag payload (for JSON payloads)
 * @param flag - Feature flag key
 * @param distinctId - User distinct ID (typically user.id or email)
 * @param properties - Additional user properties for flag evaluation (optional)
 * @returns Promise that resolves to the flag payload or null
 */
export async function getFeatureFlagPayload(
  flag: string,
  distinctId?: string,
  properties?: Record<string, any>
): Promise<any> {
  const client = getPostHogServer();
  if (!client) {
    return null;
  }

  try {
    const userId = distinctId || "anonymous";
    // PostHog Node client getFeatureFlagPayload doesn't accept properties parameter
    const payload = await client.getFeatureFlagPayload(flag, userId);
    return payload ?? null;
  } catch (error) {
    console.error(`[PostHog Server] Error getting feature flag payload "${flag}":`, error);
    return null;
  }
}

/**
 * Capture an event server-side
 * @param distinctId - User distinct ID
 * @param eventName - Event name
 * @param properties - Event properties (optional)
 */
export function captureEvent(
  distinctId: string,
  eventName: string,
  properties?: Record<string, any>
): void {
  const client = getPostHogServer();
  if (!client) {
    return;
  }

  try {
    client.capture({
      distinctId,
      event: eventName,
      properties,
    });
  } catch (error) {
    console.error(`[PostHog Server] Error capturing event "${eventName}":`, error);
  }
}

/**
 * Identify a user server-side
 * @param distinctId - User distinct ID
 * @param properties - User properties (optional)
 */
export function identifyUser(
  distinctId: string,
  properties?: Record<string, any>
): void {
  const client = getPostHogServer();
  if (!client) {
    return;
  }

  try {
    client.identify({
      distinctId,
      properties,
    });
  } catch (error) {
    console.error(`[PostHog Server] Error identifying user "${distinctId}":`, error);
  }
}

/**
 * Shutdown PostHog server client
 * Call this when shutting down the server (e.g., in cleanup handlers)
 */
export async function shutdown(): Promise<void> {
  if (posthogServer) {
    await posthogServer.shutdown();
    posthogServer = null;
  }
}

