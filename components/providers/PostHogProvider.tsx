"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { initPostHog, identifyUser, reloadFeatureFlags, resetUser } from "@/lib/posthog/client";

/**
 * PostHog Provider Component
 * 
 * Initializes PostHog on the client-side when the app loads.
 * Identifies users when authenticated and reloads feature flags.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PostHog on client mount
    initPostHog();

    // Identify user if authenticated
    const identifyAuthenticatedUser = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Identify user in PostHog
          identifyUser(user.id, user.email || undefined, {
            email: user.email,
            created_at: user.created_at,
          });

          // Reload feature flags after identification
          // This ensures flags are evaluated for the identified user
          reloadFeatureFlags();
        }
      } catch (error) {
        // Silently fail if auth check fails
        if (process.env.NODE_ENV === "development") {
          console.warn("[PostHogProvider] Failed to identify user:", error);
        }
      }
    };

    // Check for authenticated user after a short delay to ensure PostHog is initialized
    const timeoutId = setTimeout(identifyAuthenticatedUser, 1000);

    // Also listen for auth state changes
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        identifyUser(session.user.id, session.user.email || undefined, {
          email: session.user.email,
          created_at: session.user.created_at,
        });
        reloadFeatureFlags();
      } else if (event === "SIGNED_OUT") {
        // Reset PostHog user on logout
        resetUser();
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

