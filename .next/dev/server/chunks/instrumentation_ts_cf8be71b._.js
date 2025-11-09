module.exports = [
"[project]/instrumentation.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Next.js Instrumentation Entry Point
 *
 * This file is required by Next.js to enable the instrumentation system.
 * It loads client-side instrumentation code when running in the browser.
 *
 * Next.js will automatically call register() during app initialization.
 * The instrumentation-client.ts file will only execute its initialization
 * code when running in the browser (it has internal window checks).
 */ __turbopack_context__.s([
    "register",
    ()=>register
]);
async function register() {
    if (("TURBOPACK compile-time value", "nodejs") === "nodejs") {
    // Server-side instrumentation can be added here if needed
    // PostHog server-side client is initialized on-demand in lib/posthog/server.ts
    }
    if (("TURBOPACK compile-time value", "nodejs") === "edge") {
    // Edge runtime instrumentation can be added here if needed
    }
    // Load client-side instrumentation
    // The client-side code has internal guards to only run in the browser
    await __turbopack_context__.A("[project]/instrumentation-client.ts [instrumentation] (ecmascript, async loader)");
}
}),
];

//# sourceMappingURL=instrumentation_ts_cf8be71b._.js.map