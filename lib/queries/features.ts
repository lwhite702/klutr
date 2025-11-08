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
    const { isEnabled } = draftMode()
    const client = basehubClient(isEnabled)

    const { marketingSite } = await client.query(
      {
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
      },
      {
        fetchOptions: {
          next: { revalidate: 60 },
        },
      }
    )

    const features = marketingSite?.features?.items || []

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
    return []
  }
}

