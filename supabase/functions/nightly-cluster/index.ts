// Supabase Edge Function: nightly-cluster
// Batch function that processes all users for nightly clustering
// Embeds notes without embeddings and clusters all user notes

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

    console.log(`[nightly-cluster] Processing ${users.length} users`)

    const results = {
      usersProcessed: 0,
      usersFailed: 0,
      notesEmbedded: 0,
      notesClustered: 0,
      errors: [] as string[],
    }

    // Process each user sequentially
    for (const user of users) {
      try {
        console.log(`[nightly-cluster] Processing user ${user.email}`)

        // Step 1: Find notes without embeddings
        const { data: notesWithoutEmbeddings, error: notesError } = await supabase
          .from('notes')
          .select('id, content')
          .eq('user_id', user.id)
          .is('embedding', null)
          .eq('archived', false)
          .limit(100) // Process in batches

        if (notesError) {
          console.error(`[nightly-cluster] Error fetching notes for user ${user.email}:`, notesError)
          results.errors.push(`User ${user.email}: Failed to fetch notes`)
          results.usersFailed++
          continue
        }

        if (notesWithoutEmbeddings && notesWithoutEmbeddings.length > 0) {
          console.log(`[nightly-cluster] Found ${notesWithoutEmbeddings.length} notes to embed for user ${user.email}`)

          // Step 2: Generate embeddings for each note
          for (const note of notesWithoutEmbeddings) {
            try {
              // Call embed-note Edge Function
              const embedResponse = await fetch(`${SUPABASE_URL}/functions/v1/embed-note`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: note.content }),
              })

              if (!embedResponse.ok) {
                throw new Error(`Embedding failed: ${embedResponse.statusText}`)
              }

              const embedData = await embedResponse.json()
              if (!embedData.embedding || !Array.isArray(embedData.embedding)) {
                throw new Error('Invalid embedding response')
              }

              // Update note with embedding using pgvector
              const { error: updateError } = await supabase.rpc('update_note_embedding', {
                note_id_param: note.id,
                embedding_param: `[${embedData.embedding.join(',')}]`,
              })

              if (updateError) {
                // Fallback: direct update
                const { error: directUpdateError } = await supabase
                  .from('notes')
                  .update({ embedding: embedData.embedding })
                  .eq('id', note.id)

                if (directUpdateError) {
                  console.error(`[nightly-cluster] Failed to update embedding for note ${note.id}:`, directUpdateError)
                  results.errors.push(`Note ${note.id}: Failed to update embedding`)
                } else {
                  results.notesEmbedded++
                }
              } else {
                results.notesEmbedded++
              }
            } catch (error) {
              console.error(`[nightly-cluster] Failed to embed note ${note.id}:`, error)
              results.errors.push(`Note ${note.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
          }
        }

        // Step 3: Cluster user's notes
        try {
          const clusterResponse = await fetch(`${SUPABASE_URL}/functions/v1/cluster-notes`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id }),
          })

          if (!clusterResponse.ok) {
            throw new Error(`Clustering failed: ${clusterResponse.statusText}`)
          }

          const clusterData = await clusterResponse.json()
          const notesClustered = clusterData.message?.match(/\d+/)?.[0] || '0'
          results.notesClustered += parseInt(notesClustered, 10)

          console.log(`[nightly-cluster] Completed clustering for user ${user.email}`)
        } catch (error) {
          console.error(`[nightly-cluster] Error clustering notes for user ${user.email}:`, error)
          results.errors.push(`User ${user.email}: Clustering failed`)
          // Continue to next user even if clustering fails
        }

        results.usersProcessed++
      } catch (error) {
        console.error(`[nightly-cluster] Error processing user ${user.email}:`, error)
        results.errors.push(`User ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        results.usersFailed++
      }
    }

    console.log(`[nightly-cluster] Job completed: ${results.usersProcessed} users processed, ${results.usersFailed} failed`)

    return new Response(
      JSON.stringify({
        success: true,
        usersProcessed: results.usersProcessed,
        usersFailed: results.usersFailed,
        notesEmbedded: results.notesEmbedded,
        notesClustered: results.notesClustered,
        errors: results.errors.slice(0, 10), // Limit error details
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[nightly-cluster] Job failed:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

