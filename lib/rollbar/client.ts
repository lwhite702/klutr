/**
 * Rollbar Client-Side Integration
 * 
 * Provides singleton Rollbar client instance for browser-side error tracking.
 * Initializes only on client-side to avoid SSR issues.
 */

import Rollbar from "rollbar";

let rollbarClient: Rollbar | null = null;
let isInitialized = false;

/**
 * Create Rollbar configuration object
 * @param accessToken - Rollbar access token
 * @returns Rollbar configuration object
 */
function createRollbarConfig(accessToken: string): Rollbar.Configuration {
  return {
    accessToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: process.env.NODE_ENV || "development",
      code_version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "unknown",
      client: {
        javascript: {
          source_map_enabled: true,
          code_version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "unknown",
          // Optionally provide source map URL if you have source maps deployed
          // guess_uncaught_frames: true,
        },
      },
    },
    // Only report errors in production, or when explicitly enabled in development
    enabled: process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ROLLBAR_ENABLED === "true",
    // Verbose logging in development
    verbose: process.env.NODE_ENV === "development",
    // Ignore specific errors if needed
    ignoredMessages: [
      // Add patterns for errors you want to ignore
      // Example: "Script error",
    ],
  };
}

/**
 * Initialize Rollbar client (singleton pattern)
 * Only initializes once, even if called multiple times
 */
export function initRollbar(): void {
  // Only initialize on client-side
  if (typeof window === "undefined") {
    return;
  }

  // Return if already initialized
  if (isInitialized && rollbarClient) {
    return;
  }

  // TODO: Replace with your Rollbar access token
  // Get your access token from: https://rollbar.com/settings/accounts/YOUR_ACCOUNT/projects/YOUR_PROJECT/access_tokens/
  // Use NEXT_PUBLIC_ prefix for client-side environment variables
  const accessToken = process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn(
      "[Rollbar Client] NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN is not set. Client-side error tracking will be disabled."
    );
    return;
  }

  try {
    rollbarClient = new Rollbar(createRollbarConfig(accessToken));
    isInitialized = true;

    if (process.env.NODE_ENV === "development") {
      console.log("[Rollbar Client] Rollbar initialized successfully");
    }
  } catch (error) {
    console.error("[Rollbar Client] Failed to initialize:", error);
  }
}

/**
 * Get Rollbar client instance
 * Returns null if not initialized or on server-side
 */
export function getRollbarClient(): Rollbar | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!isInitialized) {
    initRollbar();
  }

  return rollbarClient;
}

/**
 * Report an error to Rollbar
 * @param error - Error object or error message
 * @param custom - Optional custom data to include
 */
export function reportError(
  error: Error | string,
  custom?: Record<string, any>
): void {
  const rollbar = getRollbarClient();
  if (!rollbar) {
    return;
  }

  try {
    if (error instanceof Error) {
      rollbar.error(error, undefined, custom);
    } else {
      rollbar.error(error, undefined, custom);
    }
  } catch (err) {
    console.error("[Rollbar Client] Error reporting to Rollbar:", err);
  }
}

/**
 * Report a warning to Rollbar
 * @param message - Warning message
 * @param custom - Optional custom data to include
 */
export function reportWarning(
  message: string,
  custom?: Record<string, any>
): void {
  const rollbar = getRollbarClient();
  if (!rollbar) {
    return;
  }

  try {
    rollbar.warning(message, undefined, custom);
  } catch (err) {
    console.error("[Rollbar Client] Error reporting warning to Rollbar:", err);
  }
}

/**
 * Report an info message to Rollbar
 * @param message - Info message
 * @param custom - Optional custom data to include
 */
export function reportInfo(
  message: string,
  custom?: Record<string, any>
): void {
  const rollbar = getRollbarClient();
  if (!rollbar) {
    return;
  }

  try {
    rollbar.info(message, undefined, custom);
  } catch (err) {
    console.error("[Rollbar Client] Error reporting info to Rollbar:", err);
  }
}

/**
 * Set person context for error tracking
 * @param userId - User ID
 * @param email - User email (optional)
 * @param username - Username (optional)
 * @param extra - Additional person data (optional)
 */
export function setPerson(
  userId: string,
  email?: string,
  username?: string,
  extra?: Record<string, any>
): void {
  const rollbar = getRollbarClient();
  if (!rollbar) {
    return;
  }

  try {
    rollbar.configure({
      payload: {
        person: {
          id: userId,
          email,
          username,
          ...extra,
        },
      },
    });
  } catch (err) {
    console.error("[Rollbar Client] Error setting person context:", err);
  }
}

/**
 * Clear person context (call on logout)
 */
export function clearPerson(): void {
  const rollbar = getRollbarClient();
  if (!rollbar) {
    return;
  }

  try {
    rollbar.configure({
      payload: {
        person: undefined,
      },
    });
  } catch (err) {
    console.error("[Rollbar Client] Error clearing person context:", err);
  }
}

