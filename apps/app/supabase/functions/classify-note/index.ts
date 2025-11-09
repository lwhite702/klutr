// Supabase Edge Function: classify-note
// Handles note classification using OpenAI

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const CLASSIFICATION_PROMPT = `You are a note classification assistant. Analyze the given note content and classify it into one of these types:

- idea: Creative thoughts, business ideas, product concepts, brainstorming
- task: Action items, todos, reminders, things to do
- contact: Names, phone numbers, email addresses, people to reach out to
- link: URLs, web references, articles to read
- image: References to images, screenshots, visual content
- voice: Voice memo transcriptions, audio notes
- misc: General notes that don't fit other categories
- nope: Spam, junk, irrelevant content, things to ignore
- unclassified: Cannot determine type

Also extract 2-5 relevant tags (lowercase, single words or short phrases) that describe the content.

Respond with JSON in this exact format:
{
  "type": "idea",
  "tags": ["startup", "ai", "product"]
}`

serve(async (req) => {
  try {
    const { content } = await req.json()

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Call OpenAI for classification
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: CLASSIFICATION_PROMPT },
          { role: 'user', content: content.slice(0, 2000) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const result = JSON.parse(data.choices[0]?.message?.content || '{}')

    // Validate response
    const validTypes = ['idea', 'task', 'contact', 'link', 'image', 'voice', 'misc', 'nope', 'unclassified']
    if (!validTypes.includes(result.type)) {
      result.type = 'unclassified'
    }

    if (!Array.isArray(result.tags)) {
      result.tags = []
    }

    result.tags = result.tags
      .slice(0, 5)
      .map((tag: string) => String(tag).toLowerCase().trim())
      .filter((tag: string) => tag.length > 0 && tag.length < 50)

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Classification error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to classify note',
        type: 'unclassified',
        tags: []
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
