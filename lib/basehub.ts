import { basehub } from 'basehub'

/**
 * BaseHub client for querying marketing, blog, and legal content.
 * 
 * BaseHub uses BASEHUB_TOKEN environment variable for authentication.
 * The token can be found in your BaseHub repository's "Connect to Your App" tab.
 * 
 * Usage:
 * ```ts
 * import { basehubClient } from '@/lib/basehub'
 * 
 * const data = await basehubClient().query({
 *   // your query here
 * })
 * ```
 * 
 * For draft mode (Next.js preview):
 * ```ts
 * import { draftMode } from 'next/headers'
 * const { isEnabled } = draftMode()
 * const data = await basehubClient(isEnabled).query({ ... })
 * ```
 */
export const basehubClient = (draft?: boolean) => {
  const token = process.env.BASEHUB_TOKEN || process.env.BASEHUB_API_TOKEN

  // Use passed draft parameter, fallback to environment variable
  const isDraft = draft ?? process.env.BASEHUB_DRAFT === 'true'

  if (!token) {
    // In development, allow missing token with warning
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'BASEHUB_TOKEN or BASEHUB_API_TOKEN not set. BaseHub queries will fail gracefully.'
      )
    }
    // Return a mock client that will fail gracefully in queries
    return {
      query: async () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('BaseHub query attempted without token - returning empty result')
        }
        return {}
      },
      mutation: async () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('BaseHub mutation attempted without token - returning empty result')
        }
        return {}
      },
    } as unknown as ReturnType<typeof basehub>
  }

  try {
    return basehub({
      token,
      // Enable draft mode for previewing unpublished content
      draft: isDraft,
      // Optional: specify a branch or commit ref
      ref: process.env.BASEHUB_REF,
    })
  } catch (error) {
    // If basehub initialization fails, return a mock client
    console.error('Failed to initialize BaseHub client:', error)
    return {
      query: async () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('BaseHub client initialization failed - returning empty result')
        }
        return {}
      },
      mutation: async () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('BaseHub mutation attempted - returning empty result')
        }
        return {}
      },
    } as unknown as ReturnType<typeof basehub>
  }
}

// Export the basehub function directly for advanced usage
export { basehub }

