// Supabase Edge Function: build-stacks
// Builds smart stacks from clustered notes

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!

serve(async (req) => {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get cluster distribution
    const { data: clusterGroups } = await supabase
      .from('notes')
      .select('cluster')
      .eq('user_id', userId)
      .not('cluster', 'is', null)
      .eq('archived', false)

    // Count by cluster
    const clusterCounts = new Map<string, number>()
    for (const note of clusterGroups || []) {
      if (note.cluster) {
        clusterCounts.set(note.cluster, (clusterCounts.get(note.cluster) || 0) + 1)
      }
    }

    const stacks = []
    for (const [cluster, count] of clusterCounts.entries()) {
      if (count < 2) continue

      // Get representative notes
      const { data: notes } = await supabase
        .from('notes')
        .select('content, type')
        .eq('user_id', userId)
        .eq('cluster', cluster)
        .eq('archived', false)
        .order('created_at', { ascending: false })
        .limit(5)

      const noteContents = (notes || [])
        .map(n => n.content.slice(0, 200))
        .join('\n\n')

      // Generate summary
      const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You create concise, insightful summaries of note collections. Keep it to 1-2 sentences.',
            },
            {
              role: 'user',
              content: `Summarize the theme of these "${cluster}" notes:\n\n${noteContents}`,
            },
          ],
          temperature: 0.5,
          max_tokens: 100,
        }),
      })

      const summaryData = await summaryResponse.json()
      const summary = summaryData.choices[0]?.message?.content || `Collection of ${cluster.toLowerCase()} notes.`

      // Check if stack exists
      const { data: existing } = await supabase
        .from('smart_stacks')
        .select('*')
        .eq('user_id', userId)
        .eq('cluster', cluster)
        .maybeSingle()

      if (existing) {
        await supabase
          .from('smart_stacks')
          .update({
            note_count: count,
            summary,
          })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('smart_stacks')
          .insert({
            user_id: userId,
            name: cluster,
            cluster,
            note_count: count,
            summary,
            pinned: false,
          })
      }

      stacks.push({ cluster, count })
    }

    return new Response(
      JSON.stringify({ message: `Built ${stacks.length} smart stacks`, stacks }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Build stacks error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to build stacks' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
