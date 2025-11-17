/**
 * Admin Authentication Helpers
 * 
 * Provides admin-level authentication and authorization checks
 */

import { getCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Check if current user is an admin
 * @throws Error if user is not authenticated or not an admin
 */
export async function requireAdmin(): Promise<{
  id: string;
  email: string;
  isAdmin: boolean;
}> {
  const user = await getCurrentUser();

  // Check if user has admin role
  const { data: userData, error } = await supabaseAdmin
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (error || !userData || !userData.is_admin) {
    throw new Error("Unauthorized: Admin access required");
  }

  return {
    ...user,
    isAdmin: userData.is_admin,
  };
}

/**
 * Check if current user is an admin (non-throwing version)
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

