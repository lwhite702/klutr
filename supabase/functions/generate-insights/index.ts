// Supabase Edge Function: generate-insights
// Generates weekly insights for users

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

    // Get start of current week (Monday)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() + diff)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    // Fetch notes from past week
    const { data: notes } = await supabase
      .from('notes')
      .select('content, type, cluster, created_at')
      .eq('user_id', userId)
      .eq('archived', false)
      .gte('created_at', weekStart.toISOString())
      .lt('created_at', weekEnd.toISOString())
      .order('created_at', { ascending: false })

    if (!notes || notes.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No notes found for weekly insights' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const noteSummary = notes
      .slice(0, 50)
      .map(n => `[${n.type}] ${n.content.slice(0, 200)}`)
      .join('\n\n')

    const prompt = `Analyze these notes from the past week and provide:
1. A 2-3 sentence summary of the main themes and patterns
2. The dominant sentiment (choose one: positive, negative, mixed, neutral, determined, anxious, excited, reflective)

Notes:
${noteSummary}

Respond with JSON:
{
  "summary": "...",
  "sentiment": "..."
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a thoughtful analyst helping someone understand patterns in their thinking.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      }),
    })

    const data = await response.json()
    const result = JSON.parse(data.choices[0]?.message?.content || '{}')

    // Upsert weekly insight
    const { data: existing } = await supabase
      .from('weekly_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start', weekStart.toISOString())
      .maybeSingle()

    if (existing) {
      await supabase
        .from('weekly_insights')
        .update({
          summary: result.summary,
          sentiment: result.sentiment,
          note_count: notes.length,
        })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('weekly_insights')
        .insert({
          user_id: userId,
          week_start: weekStart.toISOString(),
          summary: result.summary,
          sentiment: result.sentiment,
          note_count: notes.length,
        })
    }

    return new Response(
      JSON.stringify({ 
        message: `Generated weekly insight for ${notes.length} notes`,
        summary: result.summary,
        sentiment: result.sentiment
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Generate insights error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate insights' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
