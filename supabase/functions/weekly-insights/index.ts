// Supabase Edge Function: weekly-insights
// Batch function that processes all users for weekly insights generation
// Generates weekly insights summary for each user

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')

    if (usersError) {
      console.error('Error fetching users:', usersError)
      throw usersError
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users found', usersProcessed: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(`[weekly-insights] Processing ${users.length} users`)

    const results = {
      usersProcessed: 0,
      usersFailed: 0,
      insightsGenerated: 0,
      errors: [] as string[],
    }

    // Process each user sequentially
    for (const user of users) {
      try {
        console.log(`[weekly-insights] Generating insights for user ${user.email}`)

        // Call generate-insights Edge Function for this user
        const insightsResponse = await fetch(`${SUPABASE_URL}/functions/v1/generate-insights`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        })

        if (!insightsResponse.ok) {
          const errorText = await insightsResponse.text()
          throw new Error(`Insights generation failed: ${errorText}`)
        }

        const insightsData = await insightsResponse.json()

        // Check if insights were actually generated (user might not have notes)
        if (insightsData.message && !insightsData.message.includes('No notes found')) {
          results.insightsGenerated++
        }

        console.log(`[weekly-insights] Completed insights for user ${user.email}`)
        results.usersProcessed++
      } catch (error) {
        console.error(`[weekly-insights] Error processing user ${user.email}:`, error)
        results.errors.push(`User ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        results.usersFailed++
      }
    }

    console.log(`[weekly-insights] Job completed: ${results.usersProcessed} users processed, ${results.usersFailed} failed`)

    return new Response(
      JSON.stringify({
        success: true,
        usersProcessed: results.usersProcessed,
        usersFailed: results.usersFailed,
        insightsGenerated: results.insightsGenerated,
        errors: results.errors.slice(0, 10), // Limit error details
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[weekly-insights] Job failed:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

