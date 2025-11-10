import { basehubClient } from '../basehub'
import { getSafeDraftMode } from '../utils/draft-mode'

export interface ChangelogEntry {
  _id: string
  _title: string
  title: string
  slug: string
  description: string | null
  version: string | null
  releaseDate: string | null
  category: 'feature' | 'ui' | 'infra' | 'docs' | 'risk' | null
  tags: string[]
}

/**
 * Fetch all changelog entries from BaseHub
 * Supports draft mode for previewing unpublished content
 */
export async function getChangelogEntries(): Promise<ChangelogEntry[]> {
  try {
    const isEnabled = await getSafeDraftMode()
    const client = basehubClient(isEnabled)

    const result = await client.query({
      marketingSite: {
        changelog: {
          items: {
            _id: true,
            _title: true,
            title: true,
            slug: true,
            description: {
              plainText: true,
            },
            version: true,
            releaseDate: true,
            category: true,
            tags: true,
          },
        },
      },
    }) as {
      marketingSite?: {
        changelog?: {
          items?: Array<{
            _id: string
            _title: string
            title: string
            slug: string
            description?: { plainText?: string }
            version: string | null
            releaseDate: string | null
            category: 'feature' | 'ui' | 'infra' | 'docs' | 'risk' | null
            tags: string[]
          }>
        }
      }
    }

    const changelog = result.marketingSite?.changelog?.items || []

    return changelog.map((entry: any) => ({
      _id: entry._id || '',
      _title: entry._title || entry.title || '',
      title: entry.title || '',
      slug: entry.slug || '',
      description: entry.description?.plainText || null,
      version: entry.version || null,
      releaseDate: entry.releaseDate || null,
      category: entry.category || null,
      tags: entry.tags || [],
    }))
  } catch (error) {
    console.error('Error fetching changelog from BaseHub:', error)
    return []
  }
}

/**
 * Get the latest changelog entries (sorted by release date, most recent first)
 */
export async function getLatestChangelogEntries(limit: number = 3): Promise<ChangelogEntry[]> {
  const entries = await getChangelogEntries()
  
  return entries
    .sort((a, b) => {
      if (!a.releaseDate && !b.releaseDate) return 0
      if (!a.releaseDate) return 1
      if (!b.releaseDate) return -1
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    })
    .slice(0, limit)
}
