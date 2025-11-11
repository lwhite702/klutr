import { basehubClient } from '../basehub'
import { draftMode } from 'next/headers'

export interface HomePageData {
  slug: string
  title: string | null
  seoTitle: string | null
  metaDescription: string | null
  heroHeadline: string | null
  heroSubtext: string | null
  primaryCTA: string | null
  secondaryCTA: string | null
}

/**
 * Fetch home page content from BaseHub
 * Supports draft mode for previewing unpublished content
 */
export async function getHomePage(): Promise<HomePageData | null> {
  try {
    const { isEnabled } = await draftMode()
    const client = basehubClient(isEnabled)

    const result = await client.query({
      marketingSite: {
        pages: {
          __args: {
            filter: {
              slug: { _eq: 'home' },
            },
          },
          items: {
            slug: true,
            title: true,
            seoTitle: true,
            metaDescription: true,
            heroHeadline: true,
            heroSubtext: {
              plainText: true,
            },
            primaryCTA: true,
            secondaryCTA: true,
          },
        },
      },
    }) as {
      marketingSite?: {
        pages?: {
          items?: Array<{
            slug: string
            title: string | null
            seoTitle: string | null
            metaDescription: string | null
            heroHeadline: string | null
            heroSubtext?: { plainText?: string }
            primaryCTA: string | null
            secondaryCTA: string | null
          }>
        }
      }
    }

    const marketingSite = result.marketingSite

    const page = marketingSite?.pages?.items?.[0]

    if (!page) {
      console.warn('Home page not found in BaseHub')
      return null
    }

    return {
      slug: page.slug || 'home',
      title: page.title || null,
      seoTitle: page.seoTitle || null,
      metaDescription: page.metaDescription || null,
      heroHeadline: page.heroHeadline || null,
      heroSubtext: page.heroSubtext?.plainText || null,
      primaryCTA: page.primaryCTA || null,
      secondaryCTA: page.secondaryCTA || null,
    }
  } catch (error) {
    console.error('Error fetching home page from BaseHub:', error)
    return null
  }
}

