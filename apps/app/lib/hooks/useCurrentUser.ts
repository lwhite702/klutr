"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export interface CurrentUser {
  id: string;
  email: string | null;
}

/**
 * Hook to get current authenticated user on client side
 * Returns user object, loading state, and error state
 */
export function useCurrentUser(): {
  user: CurrentUser | null;
  loading: boolean;
  error: Error | null;
} {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get initial user
    const getInitialUser = async () => {
      try {
        setLoading(true);
        const {
          data: { user: authUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email || null,
          });
        } else {
          setUser(null);
        }
        setError(null);
      } catch (err) {
        console.error("[useCurrentUser] Error getting user:", err);
        setError(err instanceof Error ? err : new Error("Failed to get user"));
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || null,
        });
        setError(null);
        setLoading(false);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setError(null);
        setLoading(false);
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
}

