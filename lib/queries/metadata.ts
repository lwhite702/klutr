import { basehubClient } from '../basehub'
import { draftMode } from 'next/headers'

export interface PageMetadata {
  seoTitle: string | null
  metaDescription: string | null
}

/**
 * Fetch page metadata (SEO title and description) from BaseHub
 * Supports draft mode for previewing unpublished content
 */
export async function getPageMetadata(
  slug: string
): Promise<PageMetadata | null> {
  try {
    const { isEnabled } = draftMode()
    const client = basehubClient(isEnabled)

    const { marketingSite } = await client.query(
      {
        marketingSite: {
          pages: {
            __args: {
              filter: {
                slug: { _eq: slug },
              },
            },
            items: {
              seoTitle: true,
              metaDescription: true,
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

    const page = marketingSite?.pages?.items?.[0]

    if (!page) {
      return null
    }

    return {
      seoTitle: page.seoTitle || null,
      metaDescription: page.metaDescription || null,
    }
  } catch (error) {
    console.error('Error fetching page metadata from BaseHub:', error)
    return null
  }
}

