(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/posthog/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * PostHog Client-Side Integration
 * 
 * Provides singleton PostHog client instance for browser-side analytics and feature flags.
 * Initializes only on client-side to avoid SSR issues.
 */ __turbopack_context__.s([
    "captureEvent",
    ()=>captureEvent,
    "getFeatureFlag",
    ()=>getFeatureFlag,
    "getFeatureFlagPayload",
    ()=>getFeatureFlagPayload,
    "getPostHogClient",
    ()=>getPostHogClient,
    "identifyUser",
    ()=>identifyUser,
    "initPostHog",
    ()=>initPostHog,
    "isFeatureEnabled",
    ()=>isFeatureEnabled,
    "reloadFeatureFlags",
    ()=>reloadFeatureFlags,
    "resetUser",
    ()=>resetUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$js$40$1$2e$290$2e$0$2f$node_modules$2f$posthog$2d$js$2f$dist$2f$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-js@1.290.0/node_modules/posthog-js/dist/module.js [app-client] (ecmascript)");
;
let posthogClient = null;
let isInitialized = false;
let initPromise = null;
function initPostHog() {
    // Only initialize on client-side
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Return if already initialized
    if (isInitialized && posthogClient) {
        return;
    }
    // If initialization is in progress, return the existing promise
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const apiKey = ("TURBOPACK compile-time value", "phc_teHaSmzy4B0pxAMQ5WGajjGYMuVIzHK1Oafo5xJWcNZ");
    const apiHost = ("TURBOPACK compile-time value", "https://us.i.posthog.com") || "https://us.posthog.com";
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Initialize PostHog
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$js$40$1$2e$290$2e$0$2f$node_modules$2f$posthog$2d$js$2f$dist$2f$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].init(apiKey, {
        api_host: "/ingest",
        ui_host: apiHost,
        capture_exceptions: true,
        debug: ("TURBOPACK compile-time value", "development") === "development",
        loaded: (posthog)=>{
            posthogClient = posthog;
            isInitialized = true;
            // Set up feature flags ready callback
            posthog.onFeatureFlags(()=>{
                if ("TURBOPACK compile-time truthy", 1) {
                    console.log("[PostHog] Feature flags loaded");
                }
            });
        }
    });
    posthogClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$js$40$1$2e$290$2e$0$2f$node_modules$2f$posthog$2d$js$2f$dist$2f$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
}
function getPostHogClient() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (!isInitialized) {
        initPostHog();
    }
    return posthogClient;
}
function identifyUser(userId, email, properties) {
    const client = getPostHogClient();
    if (!client) {
        return;
    }
    client.identify(userId, {
        email,
        ...properties
    });
}
function resetUser() {
    const client = getPostHogClient();
    if (!client) {
        return;
    }
    client.reset();
}
async function isFeatureEnabled(flag) {
    const client = getPostHogClient();
    if (!client) {
        return false;
    }
    // Wait for PostHog to be ready
    return new Promise((resolve)=>{
        // Use onFeatureFlags callback to ensure flags are loaded
        client.onFeatureFlags(()=>{
            const enabled = client.isFeatureEnabled(flag);
            resolve(enabled ?? false);
        });
    });
}
async function getFeatureFlag(flag) {
    const client = getPostHogClient();
    if (!client) {
        return null;
    }
    return new Promise((resolve)=>{
        client.onFeatureFlags(()=>{
            const value = client.getFeatureFlag(flag);
            resolve(value ?? null);
        });
    });
}
async function getFeatureFlagPayload(flag) {
    const client = getPostHogClient();
    if (!client) {
        return null;
    }
    return new Promise((resolve)=>{
        client.onFeatureFlags(()=>{
            const payload = client.getFeatureFlagPayload(flag);
            resolve(payload ?? null);
        });
    });
}
async function reloadFeatureFlags() {
    const client = getPostHogClient();
    if (!client) {
        return;
    }
    return new Promise((resolve)=>{
        client.onFeatureFlags(()=>{
            resolve();
        });
        client.reloadFeatureFlags();
    });
}
function captureEvent(eventName, properties) {
    const client = getPostHogClient();
    if (!client) {
        return;
    }
    client.capture(eventName, properties);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/instrumentation-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * PostHog Client-Side Initialization
 *
 * This file is loaded by Next.js instrumentation system for client-side initialization.
 * The actual PostHog client is managed by lib/posthog/client.ts to ensure singleton pattern.
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/posthog/client.ts [app-client] (ecmascript)");
;
// Initialize PostHog on client-side
// This is called automatically by Next.js instrumentation system
(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initPostHog"])();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_d001819a._.js.map