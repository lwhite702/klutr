// Supabase Edge Function: Classify Note
// Handles AI-powered note classification and tagging

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { OpenAI } from 'https://deno.land/x/openai@v4.20.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
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

    // Get request body
    const { noteId, content } = await req.json()

    if (!noteId || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing noteId or content' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY') ?? '',
    })

    // Classify the note
    const classificationPrompt = `Analyze this note and classify it. Return a JSON object with:
- type: one of "idea", "task", "contact", "link", "image", "voice", "misc", "nope", "unclassified"
- tags: an array of 1-5 relevant tags (lowercase, no spaces, use hyphens)

Note: "${content}"

Respond only with valid JSON, no markdown formatting.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a note classification assistant. Always respond with valid JSON only.',
        },
        { role: 'user', content: classificationPrompt },
      ],
      temperature: 0.3,
      max_tokens: 200,
    })

    const responseText = completion.choices[0]?.message?.content || '{}'
    let classification: { type: string; tags: string[] }
    
    try {
      // Remove markdown code blocks if present
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      classification = JSON.parse(cleaned)
    } catch {
      // Fallback classification
      classification = { type: 'unclassified', tags: [] }
    }

    // Ensure valid type
    const validTypes = ['idea', 'task', 'contact', 'link', 'image', 'voice', 'misc', 'nope', 'unclassified']
    if (!validTypes.includes(classification.type)) {
      classification.type = 'misc'
    }

    // Get user ID from note
    const { data: note, error: noteError } = await supabaseClient
      .from('notes')
      .select('user_id')
      .eq('id', noteId)
      .single()

    if (noteError || !note) {
      return new Response(
        JSON.stringify({ error: 'Note not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Upsert tags
    const tagIds: string[] = []
    for (const tagName of classification.tags) {
      // Check if tag exists
      const { data: existingTag } = await supabaseClient
        .from('tags')
        .select('id')
        .eq('user_id', note.user_id)
        .eq('name', tagName)
        .single()

      let tagId: string
      if (existingTag) {
        tagId = existingTag.id
      } else {
        // Create new tag
        const { data: newTag, error: tagError } = await supabaseClient
          .from('tags')
          .insert({ user_id: note.user_id, name: tagName })
          .select('id')
          .single()

        if (tagError) {
          console.error('Error creating tag:', tagError)
          continue
        }
        tagId = newTag.id
      }
      tagIds.push(tagId)
    }

    // Delete existing note-tag relationships
    await supabaseClient.from('note_tags').delete().eq('note_id', noteId)

    // Create new note-tag relationships
    if (tagIds.length > 0) {
      const noteTagLinks = tagIds.map((tagId) => ({
        note_id: noteId,
        tag_id: tagId,
      }))
      await supabaseClient.from('note_tags').insert(noteTagLinks)
    }

    // Update note with classification
    const { data: updatedNote, error: updateError } = await supabaseClient
      .from('notes')
      .update({ type: classification.type })
      .eq('id', noteId)
      .select(`
        *,
        note_tags (
          tag:tags (*)
        )
      `)
      .single()

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update note' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        type: classification.type,
        tags: classification.tags,
        note: updatedNote,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in classify-note function:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
