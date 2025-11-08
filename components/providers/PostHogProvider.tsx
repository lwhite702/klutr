"use client";

import { useEffect } from "react";
import { initPostHog } from "@/lib/posthog/client";

/**
 * PostHog Provider Component
 * 
 * Initializes PostHog on the client-side when the app loads.
 * This ensures PostHog is available for analytics and feature flags.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PostHog on client mount
    initPostHog();
  }, []);

  return <>{children}</>;
}

