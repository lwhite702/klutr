import { createParser, type EventSourceMessage } from 'eventsource-parser'

/**
 * Stream LLM response from OpenAI API with incremental chunk callbacks
 * @param prompt - The prompt to send to the LLM
 * @param onChunk - Callback function called for each text chunk received
 * @throws Error if the API request fails or response is invalid
 */
export async function streamLLMResponse(
  prompt: string,
  onChunk: (text: string) => void
): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`OpenAI API error: ${res.status} ${errorText}`)
  }

  if (!res.body) {
    throw new Error('Response body is null')
  }

  const parser = createParser({
    onEvent(event: EventSourceMessage) {
      if (event.data !== '[DONE]') {
        try {
          const json = JSON.parse(event.data)
          const text = json.choices[0]?.delta?.content || ''
          if (text) {
            onChunk(text)
          }
        } catch (error) {
          // Ignore JSON parse errors for malformed chunks
          console.error('[stream] Failed to parse chunk:', error)
        }
      }
    },
  })

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      parser.feed(chunk)
    }
  } finally {
    reader.releaseLock()
  }
}

