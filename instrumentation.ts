/**
 * Next.js Instrumentation Entry Point
 *
 * This file is required by Next.js to enable the instrumentation system.
 * It loads client-side instrumentation code when running in the browser.
 *
 * Next.js will automatically call register() during app initialization.
 * The instrumentation-client.ts file will only execute its initialization
 * code when running in the browser (it has internal window checks).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Server-side instrumentation can be added here if needed
    // PostHog server-side client is initialized on-demand in lib/posthog/server.ts
    // Rollbar server-side client is initialized on-demand in lib/rollbar/server.ts
    // Initialize Rollbar server-side to capture uncaught exceptions
    const { getRollbarServer } = await import("./lib/rollbar/server");
    getRollbarServer();
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Edge runtime instrumentation can be added here if needed
    // Note: Rollbar may not be fully supported in Edge runtime
  }

  // Load client-side instrumentation
  // The client-side code has internal guards to only run in the browser
  await import("./instrumentation-client");
}
