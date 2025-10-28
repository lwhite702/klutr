/**
 * Auth helper - stub implementation for now
 * TODO: Replace with Clerk/NextAuth/Supabase Auth
 */

export async function getCurrentUser(req?: Request): Promise<{ id: string; email: string }> {
  // Stub: return a fake user for development
  // In production, this would validate session/JWT and return real user
  return {
    id: "user_dev_123",
    email: "dev@example.com",
  }
}
