/**
 * Auth helper - stub implementation for now
 * TODO: Replace with Supabase Auth when ready
 * 
 * Structure is ready for Supabase Auth integration:
 * - Database tables support user_id foreign keys
 * - Code uses getCurrentUser() throughout
 * - When enabling auth, update this to use supabase.auth.getUser()
 */

import { getCurrentUserId } from './supabase'

export async function getCurrentUser(req?: Request): Promise<{ id: string; email: string }> {
  // Stub: return a fake user for development
  // In production with Supabase Auth enabled, this would be:
  // const { data: { user } } = await supabase.auth.getUser()
  // return { id: user.id, email: user.email }
  
  const userId = await getCurrentUserId()
  return {
    id: userId,
    email: 'dev@example.com',
  }
}
