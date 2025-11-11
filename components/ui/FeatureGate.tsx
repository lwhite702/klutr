"use client";

import { useEffect, useState } from "react";
import { featureEnabledClient } from "@/lib/featureFlags.client";

interface FeatureGateProps {
  /**
   * Feature flag key to check
   */
  flag: string;
  /**
   * User ID for personalized flags (optional)
   */
  userId?: string;
  /**
   * Content to render when flag is enabled
   */
  children: React.ReactNode;
  /**
   * Content to render when flag is disabled (optional)
   */
  fallback?: React.ReactNode;
  /**
   * Show loading state while checking flag (optional)
   */
  loading?: React.ReactNode;
}

/**
 * FeatureGate Component
 *
 * Conditionally renders children based on feature flag status.
 * Supports SSR by returning null on server and checking flag on client mount.
 *
 * @example
 * ```tsx
 * <FeatureGate flag="spark-beta">
 *   <SparkInterface />
 * </FeatureGate>
 * ```
 *
 * @example
 * ```tsx
 * <FeatureGate
 *   flag="muse-ai"
 *   userId={user.id}
 *   fallback={<div>Feature coming soon</div>}
 * >
 *   <MuseInterface />
 * </FeatureGate>
 * ```
 */
export function FeatureGate({
  flag,
  userId,
  children,
  fallback = null,
  loading = null,
}: FeatureGateProps) {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    // Check feature flag on client mount - use client-only version
    featureEnabledClient(flag, userId)
      .then((isEnabled) => {
        setEnabled(isEnabled);
      })
      .catch((error) => {
        console.error(`[FeatureGate] Error checking flag "${flag}":`, error);
        // Fail closed: show fallback on error
        setEnabled(false);
      });
  }, [flag, userId]);

  // On server, return null (SSR-safe)
  if (typeof window === "undefined") {
    return null;
  }

  // Show loading state while checking flag
  if (enabled === null && loading !== null) {
    return <>{loading}</>;
  }

  // Show loading state (nothing) while checking flag
  if (enabled === null) {
    return null;
  }

  // Render children if flag is enabled, otherwise show fallback
  return enabled ? <>{children}</> : <>{fallback}</>;
}
