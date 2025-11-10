import { basehubClient } from '../basehub'
import { getSafeDraftMode } from '../utils/draft-mode'

export interface RoadmapItem {
  _id: string
  _title: string
  title: string
  slug: string
  description: string | null
  status: 'planned' | 'in-progress' | 'completed' | null
  priority: 'high' | 'medium' | 'low' | null
  targetDate: string | null
  category: string | null
}

/**
 * Fetch all roadmap items from BaseHub
 * Supports draft mode for previewing unpublished content
 */
export async function getRoadmapItems(): Promise<RoadmapItem[]> {
  try {
    const isEnabled = await getSafeDraftMode()
    const client = basehubClient(isEnabled)

    const result = await client.query({
      marketingSite: {
        roadmap: {
          items: {
            _id: true,
            _title: true,
            title: true,
            slug: true,
            description: {
              plainText: true,
            },
            status: true,
            priority: true,
            targetDate: true,
            category: true,
          },
        },
      },
    }) as {
      marketingSite?: {
        roadmap?: {
          items?: Array<{
            _id: string
            _title: string
            title: string
            slug: string
            description?: { plainText?: string }
            status: 'planned' | 'in-progress' | 'completed' | null
            priority: 'high' | 'medium' | 'low' | null
            targetDate: string | null
            category: string | null
          }>
        }
      }
    }

    const roadmap = result.marketingSite?.roadmap?.items || []

    return roadmap.map((item: any) => ({
      _id: item._id || '',
      _title: item._title || item.title || '',
      title: item.title || '',
      slug: item.slug || '',
      description: item.description?.plainText || null,
      status: item.status || null,
      priority: item.priority || null,
      targetDate: item.targetDate || null,
      category: item.category || null,
    }))
  } catch (error) {
    console.error('Error fetching roadmap from BaseHub:', error)
    return []
  }
}

/**
 * Get the top upcoming roadmap items (planned or in-progress, sorted by priority and date)
 */
export async function getUpcomingRoadmapItems(limit: number = 3): Promise<RoadmapItem[]> {
  const items = await getRoadmapItems()
  
  return items
    .filter(item => item.status === 'planned' || item.status === 'in-progress')
    .sort((a, b) => {
      // Sort by priority first (high > medium > low)
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = (priorityOrder[b.priority || 'low'] || 0) - (priorityOrder[a.priority || 'low'] || 0)
      if (priorityDiff !== 0) return priorityDiff
      
      // Then by target date (earlier dates first)
      if (a.targetDate && b.targetDate) {
        return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
      }
      if (a.targetDate) return -1
      if (b.targetDate) return 1
      return 0
    })
    .slice(0, limit)
}
