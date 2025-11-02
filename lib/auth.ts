/**
 * Auth helper - Supabase-ready implementation
 * Auth is not enabled yet, but structured for easy migration
 */

import { db } from './supabaseDb'

/**
 * Get the current user from the request
 * For now, returns a demo user. When Supabase Auth is enabled,
 * this will validate the session and return the authenticated user.
 */
export async function getCurrentUser(req?: Request): Promise<{ id: string; email: string }> {
  // TODO: When enabling Supabase Auth, replace this with:
  // const supabase = getServerSupabase()
  // const { data: { user }, error } = await supabase.auth.getUser()
  // if (error || !user) throw new Error('Unauthorized')
  // return { id: user.id, email: user.email }

  // For MVP demo: use a fixed demo user
  const demoEmail = 'demo@klutr.app'
  const demoUserId = 'a0000000-0000-0000-0000-000000000001'

  // Ensure demo user exists in database
  try {
    const user = await db.user.findOrCreate(demoEmail)
    return {
      id: user.id,
      email: user.email,
    }
  } catch (error) {
    // Fallback to hardcoded ID if database is not available
    console.warn('[auth] Database not available, using hardcoded demo user')
    return {
      id: demoUserId,
      email: demoEmail,
    }
  }
}

/**
 * Validate an authorization header (for cron jobs)
 */
export function validateAuthHeader(req: Request): boolean {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.warn('[auth] CRON_SECRET not set, allowing all requests in development')
    return true
  }

  const token = authHeader?.replace('Bearer ', '')
  return token === cronSecret
}
