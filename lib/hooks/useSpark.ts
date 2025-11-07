import { useState } from 'react'

interface UseSparkReturn {
  loading: boolean
  response: string
  error: string | null
  runSpark: (noteId: string, prompt: string) => Promise<void>
  clearResponse: () => void
}

/**
 * Hook for interacting with Spark AI assistant
 * Handles streaming responses from /api/spark endpoint
 */
export function useSpark(): UseSparkReturn {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function runSpark(noteId: string, prompt: string) {
    if (!noteId || !prompt) {
      setError('Note ID and prompt are required')
      return
    }

    setLoading(true)
    setResponse('')
    setError(null)

    try {
      const res = await fetch('/api/spark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId, prompt }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${res.status}`)
      }

      if (!res.body) {
        throw new Error('Response body is null')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        setResponse((prev) => prev + chunk)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to run Spark'
      setError(errorMessage)
      console.error('[useSpark] Error:', err)
    } finally {
      setLoading(false)
    }
  }

  function clearResponse() {
    setResponse('')
    setError(null)
  }

  return { loading, response, error, runSpark, clearResponse }
}

