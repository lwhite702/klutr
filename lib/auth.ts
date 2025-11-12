/**
 * Auth helper - Supabase Auth integration
 * 
 * Provides both client-side and server-side authentication helpers.
 * - getCurrentUser: For API routes and server components
 * - getServerSession: For server-side session checking (used in middleware)
 */

import { getCurrentUserId } from './supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Get current user for API routes and server components
 * Uses Supabase Auth to get the authenticated user
 * 
 * @throws Error if user is not authenticated
 */
export async function getCurrentUser(req?: Request): Promise<{ id: string; email: string }> {
  // For server-side usage, create a server client
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized: No valid authentication session')
  }

  return {
    id: user.id,
    email: user.email || 'unknown@example.com',
  }
}

/**
 * Get server-side session for middleware and server components
 * Returns the user if authenticated, null otherwise
 */
export async function getServerSession(): Promise<{ id: string; email: string } | null> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll().map((cookie) => ({
              name: cookie.name,
              value: cookie.value,
            }))
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email || 'unknown@example.com',
    }
  } catch (error) {
    // If cookies() is not available (e.g., in middleware), return null
    return null
  }
}
