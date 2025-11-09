import { useState } from 'react'

interface UseMuseReturn {
  loading: boolean
  response: string
  error: string | null
  runMuse: (ideaA: string, ideaB: string) => Promise<void>
  clearResponse: () => void
}

/**
 * Hook for interacting with Muse creative remix engine
 * Handles streaming responses from /api/muse endpoint
 */
export function useMuse(): UseMuseReturn {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function runMuse(ideaA: string, ideaB: string) {
    if (!ideaA || !ideaB) {
      setError('Both ideas are required')
      return
    }

    setLoading(true)
    setResponse('')
    setError(null)

    try {
      const res = await fetch('/api/muse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ideaA, ideaB }),
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to run Muse'
      setError(errorMessage)
      console.error('[useMuse] Error:', err)
    } finally {
      setLoading(false)
    }
  }

  function clearResponse() {
    setResponse('')
    setError(null)
  }

  return { loading, response, error, runMuse, clearResponse }
}

