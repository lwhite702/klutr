(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/_f77e5607._.js",
"[project]/lib/posthog/client.ts [instrumentation-edge] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$js$40$1$2e$290$2e$0$2f$node_modules$2f$posthog$2d$js$2f$dist$2f$module$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-js@1.290.0/node_modules/posthog-js/dist/module.js [instrumentation-edge] (ecmascript)");
;
let posthogClient = null;
let isInitialized = false;
let initPromise = null;
function initPostHog() {
    // Only initialize on client-side
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
    const apiKey = undefined;
    const apiHost = undefined;
}
function getPostHogClient() {
    if ("TURBOPACK compile-time truthy", 1) {
        return null;
    }
    //TURBOPACK unreachable
    ;
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
}),
"[project]/instrumentation-client.ts [instrumentation-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * PostHog Client-Side Initialization
 *
 * This file is loaded by Next.js instrumentation system for client-side initialization.
 * The actual PostHog client is managed by lib/posthog/client.ts to ensure singleton pattern.
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$client$2e$ts__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/posthog/client.ts [instrumentation-edge] (ecmascript)");
;
// Initialize PostHog on client-side
// This is called automatically by Next.js instrumentation system
(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$client$2e$ts__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__["initPostHog"])();
}),
"[project]/instrumentation.ts [instrumentation-edge] (ecmascript)", ((__turbopack_context__) => {
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
    if (("TURBOPACK compile-time value", "edge") === "nodejs") {
    // Server-side instrumentation can be added here if needed
    // PostHog server-side client is initialized on-demand in lib/posthog/server.ts
    }
    if (("TURBOPACK compile-time value", "edge") === "edge") {
    // Edge runtime instrumentation can be added here if needed
    }
    // Load client-side instrumentation
    // The client-side code has internal guards to only run in the browser
    await Promise.resolve().then(()=>__turbopack_context__.i("[project]/instrumentation-client.ts [instrumentation-edge] (ecmascript)"));
}
}),
"[project]/edge-wrapper.js { MODULE => \"[project]/instrumentation.ts [instrumentation-edge] (ecmascript)\" } [instrumentation-edge] (ecmascript)", ((__turbopack_context__, module, exports) => {

self._ENTRIES ||= {};
const modProm = Promise.resolve().then(()=>__turbopack_context__.i("[project]/instrumentation.ts [instrumentation-edge] (ecmascript)"));
modProm.catch(()=>{});
self._ENTRIES["middleware_instrumentation"] = new Proxy(modProm, {
    get (modProm, name) {
        if (name === "then") {
            return (res, rej)=>modProm.then(res, rej);
        }
        let result = (...args)=>modProm.then((mod)=>(0, mod[name])(...args));
        result.then = (res, rej)=>modProm.then((mod)=>mod[name]).then(res, rej);
        return result;
    }
});
}),
]);

//# sourceMappingURL=_f77e5607._.js.map