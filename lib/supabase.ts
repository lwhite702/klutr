import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client (for browser)
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Missing Supabase environment variables')
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client (for API routes and Edge Functions)
export function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('[Supabase] Missing Supabase server environment variables')
    return null
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Singleton for server-side usage
let serverClientInstance: ReturnType<typeof createSupabaseServerClient> | null = null

export function getSupabaseServerClient() {
  if (!serverClientInstance) {
    serverClientInstance = createSupabaseServerClient()
  }
  return serverClientInstance
}
