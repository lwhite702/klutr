module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/posthog/api.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * PostHog REST API Client
 * 
 * Provides functions to manage PostHog resources via REST API.
 * Requires Personal API Key (not project API key) for management operations.
 */ __turbopack_context__.s([
    "createDefaultFeatureFlags",
    ()=>createDefaultFeatureFlags,
    "createFeatureFlag",
    ()=>createFeatureFlag,
    "deleteFeatureFlag",
    ()=>deleteFeatureFlag,
    "getFeatureFlag",
    ()=>getFeatureFlag,
    "updateFeatureFlag",
    ()=>updateFeatureFlag
]);
/**
 * Get PostHog API configuration
 */ function getApiConfig() {
    const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY;
    const host = ("TURBOPACK compile-time value", "https://us.i.posthog.com") || "https://us.posthog.com";
    const projectId = process.env.POSTHOG_PROJECT_ID;
    if (!personalApiKey) {
        throw new Error("POSTHOG_PERSONAL_API_KEY is required for API operations. " + "Get it from PostHog → Settings → Personal API Keys");
    }
    if (!projectId) {
        throw new Error("POSTHOG_PROJECT_ID is required. " + "Get it from PostHog → Project Settings");
    }
    return {
        personalApiKey,
        host,
        projectId
    };
}
async function createFeatureFlag(options) {
    const { personalApiKey, host, projectId } = getApiConfig();
    const url = `${host}/api/projects/${projectId}/feature_flags/`;
    const payload = {
        key: options.key,
        name: options.name,
        active: options.active ?? false
    };
    if (options.description) {
        payload.description = options.description;
    }
    if (options.filters) {
        payload.filters = options.filters;
    }
    // If ensure_unique is true, check if flag exists first
    if (options.ensure_unique) {
        try {
            const existing = await getFeatureFlag(options.key);
            if (existing) {
                console.log(`[PostHog API] Feature flag "${options.key}" already exists, skipping creation`);
                return existing;
            }
        } catch (error) {
        // Flag doesn't exist, continue with creation
        }
    }
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${personalApiKey}`
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`PostHog API error (${response.status}): ${errorText}`);
        }
        const data = await response.json();
        console.log(`[PostHog API] Created feature flag: ${options.key}`);
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to create feature flag: ${error.message}`);
        }
        throw error;
    }
}
async function getFeatureFlag(key) {
    const { personalApiKey, host, projectId } = getApiConfig();
    const url = `${host}/api/projects/${projectId}/feature_flags/${key}/`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${personalApiKey}`
            }
        });
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`PostHog API error (${response.status}): ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        if (error instanceof Error && error.message.includes("404")) {
            return null;
        }
        throw error;
    }
}
async function updateFeatureFlag(key, updates) {
    const { personalApiKey, host, projectId } = getApiConfig();
    const url = `${host}/api/projects/${projectId}/feature_flags/${key}/`;
    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${personalApiKey}`
            },
            body: JSON.stringify(updates)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`PostHog API error (${response.status}): ${errorText}`);
        }
        const data = await response.json();
        console.log(`[PostHog API] Updated feature flag: ${key}`);
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to update feature flag: ${error.message}`);
        }
        throw error;
    }
}
async function deleteFeatureFlag(key) {
    const { personalApiKey, host, projectId } = getApiConfig();
    const url = `${host}/api/projects/${projectId}/feature_flags/${key}/`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${personalApiKey}`
            }
        });
        if (!response.ok && response.status !== 404) {
            const errorText = await response.text();
            throw new Error(`PostHog API error (${response.status}): ${errorText}`);
        }
        console.log(`[PostHog API] Deleted feature flag: ${key}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete feature flag: ${error.message}`);
        }
        throw error;
    }
}
async function createDefaultFeatureFlags() {
    const { FEATURE_FLAGS } = await __turbopack_context__.A("[project]/lib/featureFlags.ts [app-route] (ecmascript, async loader)");
    const defaultFlags = [
        {
            key: FEATURE_FLAGS.SPARK_BETA,
            name: "Spark Beta",
            description: "Beta access to Spark feature",
            active: false
        },
        {
            key: FEATURE_FLAGS.MUSE_AI,
            name: "Muse AI",
            description: "Muse AI feature access",
            active: false
        },
        {
            key: FEATURE_FLAGS.ORBIT_EXPERIMENTAL,
            name: "Orbit Experimental",
            description: "Experimental Orbit view feature",
            active: false
        },
        {
            key: FEATURE_FLAGS.VAULT_ENHANCED,
            name: "Vault Enhanced",
            description: "Enhanced vault features",
            active: false
        },
        {
            key: FEATURE_FLAGS.KLUTR_GLOBAL_DISABLE,
            name: "Klutr Global Disable",
            description: "Global kill switch - disables all experimental features when enabled",
            active: false
        }
    ];
    console.log("[PostHog API] Creating default feature flags...");
    for (const flag of defaultFlags){
        try {
            await createFeatureFlag({
                ...flag,
                ensure_unique: true
            });
        } catch (error) {
            console.error(`[PostHog API] Failed to create flag "${flag.key}":`, error);
        }
    }
    console.log("[PostHog API] Finished creating default feature flags");
}
}),
"[project]/lib/posthog/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$js$40$1$2e$290$2e$0$2f$node_modules$2f$posthog$2d$js$2f$dist$2f$module$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-js@1.290.0/node_modules/posthog-js/dist/module.js [app-route] (ecmascript)");
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
function reloadFeatureFlags() {
    const client = getPostHogClient();
    if (!client) {
        return;
    }
    client.reloadFeatureFlags();
}
function captureEvent(eventName, properties) {
    const client = getPostHogClient();
    if (!client) {
        return;
    }
    client.capture(eventName, properties);
}
// Auto-initialize on module load (client-side only)
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:readline [external] (node:readline, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:readline", () => require("node:readline"));

module.exports = mod;
}),
"[project]/lib/posthog/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * PostHog Server-Side Integration
 * 
 * Provides PostHog Node client for server-side feature flag checks.
 * Used in API routes, server components, and background jobs.
 */ __turbopack_context__.s([
    "captureEvent",
    ()=>captureEvent,
    "getFeatureFlag",
    ()=>getFeatureFlag,
    "getFeatureFlagPayload",
    ()=>getFeatureFlagPayload,
    "getFeatureFlagValue",
    ()=>getFeatureFlagValue,
    "identifyUser",
    ()=>identifyUser,
    "shutdown",
    ()=>shutdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$entrypoints$2f$index$2e$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/entrypoints/index.node.mjs [app-route] (ecmascript) <locals>");
;
let posthogServer = null;
/**
 * Get or initialize PostHog server client (singleton pattern)
 * @returns PostHog client instance or null if not configured
 */ function getPostHogServer() {
    // Return existing instance if already initialized
    if (posthogServer) {
        return posthogServer;
    }
    const apiKey = process.env.POSTHOG_SERVER_KEY;
    const host = ("TURBOPACK compile-time value", "https://us.i.posthog.com") || "https://us.posthog.com";
    if (!apiKey) {
        console.warn("[PostHog Server] POSTHOG_SERVER_KEY is not set. Server-side feature flags will be disabled.");
        return null;
    }
    try {
        posthogServer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$entrypoints$2f$index$2e$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PostHog"](apiKey, {
            host,
            flushAt: 20,
            flushInterval: 10000
        });
        return posthogServer;
    } catch (error) {
        console.error("[PostHog Server] Failed to initialize:", error);
        return null;
    }
}
async function getFeatureFlag(flag, distinctId, properties) {
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
async function getFeatureFlagValue(flag, distinctId, properties) {
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
async function getFeatureFlagPayload(flag, distinctId, properties) {
    const client = getPostHogServer();
    if (!client) {
        return null;
    }
    try {
        const userId = distinctId || "anonymous";
        const payload = await client.getFeatureFlagPayload(flag, userId, properties);
        return payload ?? null;
    } catch (error) {
        console.error(`[PostHog Server] Error getting feature flag payload "${flag}":`, error);
        return null;
    }
}
function captureEvent(distinctId, eventName, properties) {
    const client = getPostHogServer();
    if (!client) {
        return;
    }
    try {
        client.capture({
            distinctId,
            event: eventName,
            properties
        });
    } catch (error) {
        console.error(`[PostHog Server] Error capturing event "${eventName}":`, error);
    }
}
function identifyUser(distinctId, properties) {
    const client = getPostHogServer();
    if (!client) {
        return;
    }
    try {
        client.identify({
            distinctId,
            properties
        });
    } catch (error) {
        console.error(`[PostHog Server] Error identifying user "${distinctId}":`, error);
    }
}
async function shutdown() {
    if (posthogServer) {
        await posthogServer.shutdown();
        posthogServer = null;
    }
}
}),
"[project]/lib/featureFlags.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Feature Flags Middleware
 * 
 * Provides centralized feature flag management with caching.
 * Supports both client-side and server-side flag checks.
 */ __turbopack_context__.s([
    "FEATURE_FLAGS",
    ()=>FEATURE_FLAGS,
    "clearFeatureFlagCache",
    ()=>clearFeatureFlagCache,
    "clearFeatureFlagCacheFor",
    ()=>clearFeatureFlagCacheFor,
    "featureEnabled",
    ()=>featureEnabled
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/posthog/client.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/posthog/server.ts [app-route] (ecmascript)");
;
;
const FEATURE_FLAGS = {
    SPARK_BETA: "spark-beta",
    MUSE_AI: "muse-ai",
    ORBIT_EXPERIMENTAL: "orbit-experimental",
    VAULT_ENHANCED: "vault-enhanced",
    KLUTR_GLOBAL_DISABLE: "klutr-global-disable"
};
/**
 * In-memory cache for feature flags
 * Key format: `flag:${flag}:${userId || 'anonymous'}`
 * TTL: 5 minutes (300000ms)
 */ const flagCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
/**
 * Check if a cached value is still valid
 */ function isCacheValid(entry) {
    return Date.now() - entry.timestamp < CACHE_TTL;
}
/**
 * Get cache key for a flag and user
 */ function getCacheKey(flag, userId) {
    return `flag:${flag}:${userId || "anonymous"}`;
}
/**
 * Get cached flag value
 */ function getCachedValue(flag, userId) {
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
 */ function setCachedValue(flag, userId, value) {
    const key = getCacheKey(flag, userId);
    flagCache.set(key, {
        value,
        timestamp: Date.now()
    });
}
async function featureEnabled(flag, userId, useServer) {
    // Check kill switch first (always check this flag)
    if (flag !== FEATURE_FLAGS.KLUTR_GLOBAL_DISABLE) {
        const killSwitchEnabled = await featureEnabled(FEATURE_FLAGS.KLUTR_GLOBAL_DISABLE, userId, useServer);
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
    const isServer = useServer ?? ("TURBOPACK compile-time value", "undefined") === "undefined";
    let enabled = false;
    try {
        if (isServer) {
            // Server-side check
            enabled = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFeatureFlag"])(flag, userId);
        } else {
            // Client-side check
            enabled = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isFeatureEnabled"])(flag);
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
function clearFeatureFlagCache() {
    flagCache.clear();
}
function clearFeatureFlagCacheFor(flag, userId) {
    const key = getCacheKey(flag, userId);
    flagCache.delete(key);
}
}),
"[project]/lib/posthog/mcp.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * PostHog MCP Integration Helper
 * 
 * This module provides utilities to work with PostHog via MCP server.
 * When MCP tools are available, they will be used automatically.
 * Falls back to REST API if MCP is not configured.
 */ __turbopack_context__.s([
    "MCP_INSTRUCTIONS",
    ()=>MCP_INSTRUCTIONS,
    "createDefaultFeatureFlagsViaMCP",
    ()=>createDefaultFeatureFlagsViaMCP,
    "getDefaultFlags",
    ()=>getDefaultFlags
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$featureFlags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/featureFlags.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/posthog/api.ts [app-route] (ecmascript)");
;
;
async function createDefaultFeatureFlagsViaMCP() {
    // Check if MCP tools are available
    // In a real MCP setup, you would check for available MCP tools here
    // For now, we'll use the REST API as fallback
    console.log("[PostHog MCP] Attempting to create flags via MCP server...");
    try {
        // TODO: When MCP server is configured, use MCP tools here
        // Example (pseudo-code):
        // if (mcpToolsAvailable) {
        //   await mcp.posthog.createFeatureFlag({ key: FEATURE_FLAGS.SPARK_BETA, ... });
        // } else {
        //   await createViaAPI();
        // }
        // For now, fall back to REST API
        console.log("[PostHog MCP] MCP server not detected, using REST API fallback");
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createDefaultFeatureFlags"])();
    } catch (error) {
        console.error("[PostHog MCP] Error creating flags:", error);
        throw error;
    }
}
function getDefaultFlags() {
    return [
        {
            key: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$featureFlags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FEATURE_FLAGS"].SPARK_BETA,
            name: "Spark Beta",
            description: "Beta access to Spark feature",
            active: false
        },
        {
            key: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$featureFlags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FEATURE_FLAGS"].MUSE_AI,
            name: "Muse AI",
            description: "Muse AI feature access",
            active: false
        },
        {
            key: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$featureFlags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FEATURE_FLAGS"].ORBIT_EXPERIMENTAL,
            name: "Orbit Experimental",
            description: "Experimental Orbit view feature",
            active: false
        },
        {
            key: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$featureFlags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FEATURE_FLAGS"].VAULT_ENHANCED,
            name: "Vault Enhanced",
            description: "Enhanced vault features",
            active: false
        },
        {
            key: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$featureFlags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FEATURE_FLAGS"].KLUTR_GLOBAL_DISABLE,
            name: "Klutr Global Disable",
            description: "Global kill switch - disables all experimental features when enabled",
            active: false
        }
    ];
}
const MCP_INSTRUCTIONS = `
To create PostHog feature flags via MCP server:

1. Ensure PostHog MCP server is configured in Cursor settings
2. Ask the AI: "Create all the default PostHog feature flags"
3. The AI will use MCP tools to create each flag

Default flags to create:
${getDefaultFlags().map((f)=>`- ${f.key}: ${f.name}`).join('\n')}
`;
}),
"[project]/app/api/posthog/setup-flags/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/posthog/api.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$mcp$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/posthog/mcp.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        // Optional: Add authentication/authorization here
        // For now, this is open - you may want to add a secret check
        const url = new URL(request.url);
        const useMCP = url.searchParams.get("useMCP") === "true";
        if (useMCP) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$mcp$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createDefaultFeatureFlagsViaMCP"])();
        } else {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posthog$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createDefaultFeatureFlags"])();
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Feature flags created successfully"
        }, {
            status: 200
        });
    } catch (error) {
        console.error("[PostHog Setup] Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__59c3bce5._.js.map