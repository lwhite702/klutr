/**
 * Rollbar Server-Side Integration
 * 
 * Provides Rollbar client for server-side error tracking.
 * Used in API routes, server components, and background jobs.
 */

import Rollbar from "rollbar";

let rollbarServer: Rollbar | null = null;

/**
 * Get or initialize Rollbar server client (singleton pattern)
 * @returns Rollbar client instance or null if not configured
 */
export function getRollbarServer(): Rollbar | null {
  // Return existing instance if already initialized
  if (rollbarServer) {
    return rollbarServer;
  }

  // TODO: Replace with your Rollbar access token
  // Get your access token from: https://rollbar.com/settings/accounts/YOUR_ACCOUNT/projects/YOUR_PROJECT/access_tokens/
  const accessToken = process.env.ROLLBAR_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn(
      "[Rollbar Server] ROLLBAR_ACCESS_TOKEN is not set. Server-side error tracking will be disabled."
    );
    return null;
  }

  try {
    rollbarServer = new Rollbar({
      accessToken,
      captureUncaught: true,
      captureUnhandledRejections: true,
      payload: {
        environment: process.env.NODE_ENV || "development",
        code_version: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || "unknown",
        server: {
          root: process.cwd(),
          branch: process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || "main",
        },
      },
      // Only report errors in production, or when explicitly enabled in development
      enabled: process.env.NODE_ENV === "production" || process.env.ROLLBAR_ENABLED === "true",
      // Verbose logging in development
      verbose: process.env.NODE_ENV === "development",
    });

    return rollbarServer;
  } catch (error) {
    console.error("[Rollbar Server] Failed to initialize:", error);
    return null;
  }
}

/**
 * Report an error to Rollbar
 * @param error - Error object or error message
 * @param request - Optional request object for context
 * @param custom - Optional custom data to include
 */
export function reportError(
  error: Error | string,
  request?: any,
  custom?: Record<string, any>
): void {
  const rollbar = getRollbarServer();
  if (!rollbar) {
    return;
  }

  try {
    if (error instanceof Error) {
      rollbar.error(error, request, custom);
    } else {
      rollbar.error(error, request, custom);
    }
  } catch (err) {
    console.error("[Rollbar Server] Error reporting to Rollbar:", err);
  }
}

/**
 * Report a warning to Rollbar
 * @param message - Warning message
 * @param request - Optional request object for context
 * @param custom - Optional custom data to include
 */
export function reportWarning(
  message: string,
  request?: any,
  custom?: Record<string, any>
): void {
  const rollbar = getRollbarServer();
  if (!rollbar) {
    return;
  }

  try {
    rollbar.warning(message, request, custom);
  } catch (err) {
    console.error("[Rollbar Server] Error reporting warning to Rollbar:", err);
  }
}

/**
 * Report an info message to Rollbar
 * @param message - Info message
 * @param request - Optional request object for context
 * @param custom - Optional custom data to include
 */
export function reportInfo(
  message: string,
  request?: any,
  custom?: Record<string, any>
): void {
  const rollbar = getRollbarServer();
  if (!rollbar) {
    return;
  }

  try {
    rollbar.info(message, request, custom);
  } catch (err) {
    console.error("[Rollbar Server] Error reporting info to Rollbar:", err);
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
  const rollbar = getRollbarServer();
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
    console.error("[Rollbar Server] Error setting person context:", err);
  }
}

/**
 * Clear person context (call on logout)
 */
export function clearPerson(): void {
  const rollbar = getRollbarServer();
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
    console.error("[Rollbar Server] Error clearing person context:", err);
  }
}

/**
 * Shutdown Rollbar server client
 * Call this when shutting down the server (e.g., in cleanup handlers)
 */
export async function shutdown(): Promise<void> {
  if (rollbarServer) {
    try {
      // rollbarServer.wait() - method signature incompatible, skipping for now
      rollbarServer = null;
    } catch (error) {
      console.error("[Rollbar Server] Error during shutdown:", error);
    }
  }
}

