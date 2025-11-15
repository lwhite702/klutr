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
 * Note: draftMode() can only be called in request context, not during build
 */
export async function getFeatures(): Promise<FeatureData[]> {
  try {
    // Try to get draft mode, but handle gracefully if called outside request context (e.g., during build)
    let isEnabled = false
    try {
      const draft = await draftMode()
      isEnabled = draft.isEnabled
    } catch (error) {
      // draftMode() can't be called outside request context (e.g., in generateStaticParams)
      // Default to production mode (isEnabled = false)
      if (process.env.NODE_ENV === 'development') {
        console.warn('[BaseHub] draftMode() called outside request context, using production mode')
      }
    }
    const client = basehubClient(isEnabled)

    // Try querying first, if empty and not in draft mode, try draft mode as fallback
    let result = await (client as any).query({
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
            // illustrationUrl: MediaBlockUnion requires inline fragments which BaseHub query builder doesn't support
            // Will be handled separately or via BaseHub UI
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
            illustrationUrl?: null
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
        const draftResult = await (draftClient as any).query({
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
      illustrationUrl: null, // Media queries require inline fragments - skip for now
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

/**
 * Fetch a single feature by slug from BaseHub
 * Supports draft mode for previewing unpublished content
 * Note: draftMode() can only be called in request context, not during build
 */
export async function getFeatureBySlug(slug: string): Promise<FeatureData | null> {
  try {
    // Try to get draft mode, but handle gracefully if called outside request context (e.g., during build)
    let isEnabled = false
    try {
      const draft = await draftMode()
      isEnabled = draft.isEnabled
    } catch (error) {
      // draftMode() can't be called outside request context (e.g., in generateStaticParams)
      // Default to production mode (isEnabled = false)
      if (process.env.NODE_ENV === 'development') {
        console.warn('[BaseHub] draftMode() called outside request context, using production mode')
      }
    }
    const client = basehubClient(isEnabled)

    // Query with filter for slug - use 'eq' not '_eq', and fetch all then filter client-side
    // BaseHub filter syntax may vary, so we'll fetch all and filter
    const result = await (client as any).query({
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
            seoKeywords?: string | null
          }>
        }
      }
    }

    // Filter client-side since BaseHub filter syntax is inconsistent
    const features = result.marketingSite?.features?.items || []
    const feature = features.find((f) => f.slug === slug)

    if (!feature) {
      // Try draft mode as fallback if not already in draft mode
      if (!isEnabled) {
        try {
          const draftClient = basehubClient(true)
          const draftResult = await (draftClient as any).query({
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
                  seoKeywords: true,
                },
              },
            },
          }) as typeof result
          const draftFeatures = draftResult.marketingSite?.features?.items || []
          const draftFeature = draftFeatures.find((f) => f.slug === slug)
          if (draftFeature) {
            return {
              _id: draftFeature._id || '',
              _title: draftFeature._title || draftFeature.name || '',
              name: draftFeature.name || '',
              slug: draftFeature.slug || '',
              tagline: draftFeature.tagline || '',
              description: draftFeature.description?.plainText || null,
              illustrationUrl: null, // Media queries require inline fragments - skip for now
              seoKeywords: draftFeature.seoKeywords || null,
            }
          }
        } catch (draftError) {
          // Ignore draft fallback errors
          if (process.env.NODE_ENV === 'development') {
            console.warn('[BaseHub] Draft mode fallback failed for feature:', slug, draftError)
          }
        }
      }
      return null
    }

    return {
      _id: feature._id || '',
      _title: feature._title || feature.name || '',
      name: feature.name || '',
      slug: feature.slug || '',
      tagline: feature.tagline || '',
      description: feature.description?.plainText || null,
      illustrationUrl: null, // Media queries require inline fragments - skip for now
      seoKeywords: feature.seoKeywords || null,
    }
  } catch (error) {
    console.error('Error fetching feature from BaseHub:', error)
    // Log more details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('BaseHub query error details:', {
        slug,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
    }
    return null
  }
}

