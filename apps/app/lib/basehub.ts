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

  if (!token) {
    // Return a mock client that returns empty results instead of throwing
    // This allows builds to succeed even when BASEHUB_TOKEN is not set
    return {
      query: async () => {
        console.warn(
          'BASEHUB_TOKEN or BASEHUB_API_TOKEN not set. BaseHub queries will return empty results.'
        )
        return {}
      },
    }
  }

  // Use passed draft parameter, fallback to environment variable
  const isDraft = draft ?? process.env.BASEHUB_DRAFT === 'true'

  return basehub({
    token,
    // Enable draft mode for previewing unpublished content
    draft: isDraft,
    // Optional: specify a branch or commit ref
    ref: process.env.BASEHUB_REF,
  })
}

// Export the basehub function directly for advanced usage
export { basehub }

