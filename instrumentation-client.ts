/**
 * PostHog Client-Side Initialization
 *
 * This file is loaded by Next.js instrumentation system for client-side initialization.
 * The actual PostHog client is managed by lib/posthog/client.ts to ensure singleton pattern.
 */

import { initPostHog } from "@/lib/posthog/client";

// Initialize PostHog on client-side
// This is called automatically by Next.js instrumentation system
initPostHog();

