import { basehubClient } from '../basehub'
import { draftMode } from 'next/headers'

export interface LegalPage {
  _id: string
  _title: string
  title: string
  slug: string
  content: string | null
  lastUpdated: string | null
}

/**
 * Fetch a legal document by slug from BaseHub
 * Supports draft mode for previewing unpublished content
 */
export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  try {
    const { isEnabled } = draftMode()
    const client = basehubClient(isEnabled)

    const { marketingSite } = await client.query(
      {
        marketingSite: {
          legal: {
            __args: {
              filter: {
                slug: { _eq: slug },
              },
            },
            items: {
              _id: true,
              _title: true,
              title: true,
              slug: true,
              content: {
                plainText: true,
              },
              lastUpdated: true,
            },
          },
        },
      },
      {
        fetchOptions: {
          next: { revalidate: 86400 }, // Revalidate daily
        },
      }
    )

    const page = marketingSite?.legal?.items?.[0]

    if (!page) {
      return null
    }

    return {
      _id: page._id || '',
      _title: page._title || page.title || '',
      title: page.title || '',
      slug: page.slug || '',
      content: page.content?.plainText || null,
      lastUpdated: page.lastUpdated || null,
    }
  } catch (error) {
    console.error('Error fetching legal page from BaseHub:', error)
    return null
  }
}

