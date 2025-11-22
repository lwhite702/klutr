"use client";

import { useEffect, useRef, useState } from "react";
import { captureFlaggedEvent } from "@/lib/posthog/client";

interface UseStallGuardOptions {
  active: boolean;
  timeoutMs?: number;
  label?: string;
  onTimeout?: () => void;
}

/**
 * Detects stalled async flows and surfaces a recoverable state instead of
 * leaving spinners running forever.
 */
export function useStallGuard({
  active,
  timeoutMs = 5000,
  label = "operation",
  onTimeout,
}: UseStallGuardOptions) {
  const [stalled, setStalled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!active) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setStalled(false);
      return undefined;
    }

    timeoutRef.current = setTimeout(() => {
      setStalled(true);
      captureFlaggedEvent("stuck_load", {
        label,
        timeoutMs,
        source: "stall-guard",
      });
      onTimeout?.();
    }, timeoutMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [active, label, onTimeout, timeoutMs]);

  return { stalled };
}
