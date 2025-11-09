import { createClient } from '@supabase/supabase-js'

// Client-side environment variables (NEXT_PUBLIC_ prefix)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Server-side environment variables (no NEXT_PUBLIC_ prefix)
const serverSupabaseUrl = process.env.SUPABASE_URL || ''
const serverSupabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const serverSupabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

// Validate environment variables at runtime (not during build)
function validateEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
}

// Client-side Supabase client (for use in components)
// Use placeholder values during build if env vars are missing
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Server-side Supabase client with service role (bypasses RLS for admin operations)
// Uses server-only env vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) when available,
// falls back to NEXT_PUBLIC_ vars for backward compatibility
export const supabaseAdmin = (serverSupabaseUrl && serverSupabaseServiceRoleKey)
  ? createClient(
      serverSupabaseUrl,
      serverSupabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : (supabaseUrl && (serverSupabaseServiceRoleKey || supabaseAnonKey))
    ? createClient(
        supabaseUrl,
        serverSupabaseServiceRoleKey || supabaseAnonKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      )
    : createClient('https://placeholder.supabase.co', 'placeholder-key', {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

// Export validation function for runtime checks
export { validateEnv }

// Helper to get current user ID (stub for now, will be replaced with auth later)
export async function getCurrentUserId(): Promise<string> {
  // For now, return a demo user ID
  // TODO: Replace with actual auth when Supabase Auth is enabled
  return 'user_dev_123'
}
