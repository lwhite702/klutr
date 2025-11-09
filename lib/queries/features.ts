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

    // Log query attempt
    if (process.env.NODE_ENV === 'development') {
      console.log('[BaseHub] Fetching features, draft mode:', isEnabled)
    }

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
    }) as {
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

    // Log raw result in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[BaseHub] Raw query result:', JSON.stringify(result, null, 2))
    }

    let marketingSite = result.marketingSite
    let features = marketingSite?.features?.items || []

    // If no features found and not in draft mode, try draft mode as fallback
    if (features.length === 0 && !isEnabled) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[BaseHub] No features found in production, trying draft mode...')
      }
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
        }) as typeof result
        marketingSite = draftResult.marketingSite
        features = marketingSite?.features?.items || []
        if (process.env.NODE_ENV === 'development') {
          console.log('[BaseHub] Fetched features from draft mode fallback:', features.length)
          if (features.length > 0) {
            console.log('[BaseHub] Draft features:', features.map((f: any) => ({ name: f.name, slug: f.slug })))
          }
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
      console.log('[BaseHub] Final features count:', features.length)
      if (features.length > 0) {
        console.log('[BaseHub] Feature names:', features.map((f: any) => f.name))
      } else {
        console.warn('[BaseHub] No features found. Check:')
        console.warn('  1. Are features published in BaseHub?')
        console.warn('  2. Is BASEHUB_TOKEN set correctly?')
        console.warn('  3. Does the features collection exist in BaseHub?')
        console.warn('  4. Is the query structure correct?')
      }
    }

    const mappedFeatures = features.map((feature: any) => ({
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

    // Log mapped features in development
    if (process.env.NODE_ENV === 'development' && mappedFeatures.length > 0) {
      console.log('[BaseHub] Mapped features:', mappedFeatures.map(f => ({ name: f.name, slug: f.slug, hasTagline: !!f.tagline })))
    }

    return mappedFeatures
  } catch (error) {
    console.error('[BaseHub] Error fetching features:', error)
    // Log more details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[BaseHub] Error details:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      })
      
      // Check if it's a BaseHub-specific error
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('[BaseHub] Response error:', (error as any).response)
      }
    }
    return []
  }
}

