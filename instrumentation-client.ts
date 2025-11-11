/**
 * Client-Side Initialization
 *
 * This file is loaded by Next.js instrumentation system for client-side initialization.
 * The actual clients are managed by their respective lib files to ensure singleton pattern.
 */

import { initPostHog } from "@/lib/posthog/client";
import { initRollbar } from "@/lib/rollbar/client";

// Initialize PostHog on client-side
// This is called automatically by Next.js instrumentation system
initPostHog();

// Initialize Rollbar on client-side
// This is called automatically by Next.js instrumentation system
initRollbar();
