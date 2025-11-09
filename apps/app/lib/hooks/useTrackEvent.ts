"use client";

import { useCallback } from "react";
import { captureEvent } from "@/lib/posthog/client";

/**
 * Custom hook for PostHog event tracking
 * 
 * Provides a convenient way to track events in React components.
 * Handles cases where PostHog isn't initialized gracefully.
 * 
 * @example
 * ```tsx
 * const trackEvent = useTrackEvent();
 * 
 * const handleClick = () => {
 *   trackEvent('button_clicked', { button_name: 'submit' });
 *   // ... rest of handler
 * };
 * ```
 * 
 * @returns Function to track events
 */
export function useTrackEvent() {
  const track = useCallback((eventName: string, properties?: Record<string, any>) => {
    try {
      captureEvent(eventName, properties);
    } catch (error) {
      // Silently fail if PostHog isn't initialized
      // This prevents errors from breaking the app
      if (process.env.NODE_ENV === "development") {
        console.warn(`[useTrackEvent] Failed to track event "${eventName}":`, error);
      }
    }
  }, []);

  return track;
}

