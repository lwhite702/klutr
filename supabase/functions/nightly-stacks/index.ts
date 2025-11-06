// Supabase Edge Function: nightly-stacks
// Batch function that processes all users for nightly stack building
// Rebuilds smart stacks based on current cluster distribution

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

    console.log(`[nightly-stacks] Processing ${users.length} users`)

    const results = {
      usersProcessed: 0,
      usersFailed: 0,
      stacksBuilt: 0,
      errors: [] as string[],
    }

    // Process each user sequentially
    for (const user of users) {
      try {
        console.log(`[nightly-stacks] Building stacks for user ${user.email}`)

        // Call build-stacks Edge Function for this user
        const stackResponse = await fetch(`${SUPABASE_URL}/functions/v1/build-stacks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        })

        if (!stackResponse.ok) {
          const errorText = await stackResponse.text()
          throw new Error(`Stack building failed: ${errorText}`)
        }

        const stackData = await stackResponse.json()
        const stacksCount = stackData.stacks?.length || 0
        results.stacksBuilt += stacksCount

        console.log(`[nightly-stacks] Built ${stacksCount} stacks for user ${user.email}`)
        results.usersProcessed++
      } catch (error) {
        console.error(`[nightly-stacks] Error processing user ${user.email}:`, error)
        results.errors.push(`User ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        results.usersFailed++
      }
    }

    console.log(`[nightly-stacks] Job completed: ${results.usersProcessed} users processed, ${results.usersFailed} failed`)

    return new Response(
      JSON.stringify({
        success: true,
        usersProcessed: results.usersProcessed,
        usersFailed: results.usersFailed,
        stacksBuilt: results.stacksBuilt,
        errors: results.errors.slice(0, 10), // Limit error details
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[nightly-stacks] Job failed:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

