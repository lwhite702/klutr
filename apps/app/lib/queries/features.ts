import { basehubClient } from '../basehub'
import { draftMode } from 'next/headers'

export interface FeatureData {
  _id: string
  _title: string
  name: string
  slug: string
  tagline: string
  description: string | null
  illustrationUrl: {
    url: string
    fileName: string
    altText: string | null
  } | null
  seoKeywords: string | null
}

/**
 * Fetch all features from BaseHub
 * Supports draft mode for previewing unpublished content
 */
export async function getFeatures(): Promise<FeatureData[]> {
  try {
    const { isEnabled } = await draftMode()
    const client = basehubClient(isEnabled)

    // Try querying first, if empty and not in draft mode, try draft mode as fallback
    let result = await client.query({
      marketingSite: {
        features: {
          items: {
            _id: true,
            _title: true,
            name: true,
            slug: true,
            tagline: true,
            description: {
              plainText: true,
            },
            illustrationUrl: {
              url: true,
              fileName: true,
              altText: true,
            },
            seoKeywords: true,
          },
        },
      },
    } as any) as {
      marketingSite?: {
        features?: {
          items?: Array<{
            _id: string
            _title: string
            name: string
            slug: string
            tagline: string
            description?: { plainText?: string }
            illustrationUrl?: { url: string; fileName: string; altText: string | null }
            seoKeywords: string | null
          }>
        }
      }
    }

    let marketingSite = result.marketingSite
    let features = marketingSite?.features?.items || []

    // If no features found and not in draft mode, try draft mode as fallback
    if (features.length === 0 && !isEnabled) {
      try {
        const draftClient = basehubClient(true)
        const draftResult = await draftClient.query({
          marketingSite: {
            features: {
              items: {
                _id: true,
                _title: true,
                name: true,
                slug: true,
                tagline: true,
                description: {
                  plainText: true,
                },
                illustrationUrl: {
                  url: true,
                  fileName: true,
                  altText: true,
                },
                seoKeywords: true,
              },
            },
          },
        } as any) as typeof result
        marketingSite = draftResult.marketingSite
        features = marketingSite?.features?.items || []
        if (process.env.NODE_ENV === 'development') {
          console.log('[BaseHub] Fetched features from draft mode fallback:', features.length)
        }
      } catch (draftError) {
        // Ignore draft fallback errors
        if (process.env.NODE_ENV === 'development') {
          console.warn('[BaseHub] Draft mode fallback failed:', draftError)
        }
      }
    }

    // Log in development to help debug
    if (process.env.NODE_ENV === 'development') {
      console.log('[BaseHub] Fetched features:', features.length, features.map((f: any) => f.name))
    }

    return features.map((feature: any) => ({
      _id: feature._id || '',
      _title: feature._title || feature.name || '',
      name: feature.name || '',
      slug: feature.slug || '',
      tagline: feature.tagline || '',
      description: feature.description?.plainText || null,
      illustrationUrl: feature.illustrationUrl
        ? {
            url: feature.illustrationUrl.url || '',
            fileName: feature.illustrationUrl.fileName || '',
            altText: feature.illustrationUrl.altText || null,
          }
        : null,
      seoKeywords: feature.seoKeywords || null,
    }))
  } catch (error) {
    console.error('Error fetching features from BaseHub:', error)
    // Log more details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('BaseHub query error details:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
    }
    return []
  }
}

