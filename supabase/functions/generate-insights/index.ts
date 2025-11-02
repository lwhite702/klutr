// Supabase Edge Function: Generate Weekly Insights
// Creates weekly summaries and insights for users

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { OpenAI } from 'https://deno.land/x/openai@v4.20.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const { userId, weekStart } = await req.json()

    if (!userId || !weekStart) {
      return new Response(
        JSON.stringify({ error: 'Missing userId or weekStart' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get notes for the week
    const weekStartDate = new Date(weekStart)
    const weekEndDate = new Date(weekStartDate)
    weekEndDate.setDate(weekEndDate.getDate() + 7)

    const { data: notes, error: notesError } = await supabaseClient
      .from('notes')
      .select('content, type, created_at')
      .eq('user_id', userId)
      .gte('created_at', weekStartDate.toISOString())
      .lt('created_at', weekEndDate.toISOString())
      .order('created_at', { ascending: false })

    if (notesError) {
      throw notesError
    }

    if (!notes || notes.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No notes found for this week', noteCount: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY') ?? '',
    })

    // Generate insight
    const notesText = notes.map((n, i) => `${i + 1}. [${n.type}] ${n.content.slice(0, 200)}`).join('\n')

    const insightPrompt = `Analyze these notes from a week and create a summary:

${notesText}

Provide a JSON response with:
- summary: A 2-3 sentence summary of themes and patterns
- sentiment: One of "positive", "negative", "mixed", "neutral", "determined"
- noteCount: ${notes.length}

Respond only with valid JSON, no markdown formatting.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an insights assistant. Always respond with valid JSON only.',
        },
        { role: 'user', content: insightPrompt },
      ],
      temperature: 0.5,
      max_tokens: 300,
    })

    const responseText = completion.choices[0]?.message?.content || '{}'
    let insight: { summary: string; sentiment: string; noteCount: number }

    try {
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      insight = JSON.parse(cleaned)
    } catch {
      insight = {
        summary: `Captured ${notes.length} notes this week covering various topics.`,
        sentiment: 'neutral',
        noteCount: notes.length,
      }
    }

    // Ensure valid sentiment
    const validSentiments = ['positive', 'negative', 'mixed', 'neutral', 'determined']
    if (!validSentiments.includes(insight.sentiment)) {
      insight.sentiment = 'neutral'
    }

    // Upsert weekly insight
    const { data: savedInsight, error: upsertError } = await supabaseClient
      .from('weekly_insights')
      .upsert(
        {
          user_id: userId,
          week_start: weekStartDate.toISOString(),
          summary: insight.summary,
          sentiment: insight.sentiment,
          note_count: notes.length,
        },
        {
          onConflict: 'user_id,week_start',
        }
      )
      .select()
      .single()

    if (upsertError) {
      throw upsertError
    }

    return new Response(
      JSON.stringify({
        success: true,
        insight: savedInsight,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-insights function:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
