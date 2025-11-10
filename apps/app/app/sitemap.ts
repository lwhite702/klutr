import { MetadataRoute } from 'next'
import { basehubClient } from '@/lib/basehub'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://klutr.app'

  // Static routes
  const staticRoutes = [
    '',
    '/app',
    '/boards',
    '/chat',
    '/flux',
    '/insights',
    '/memory',
    '/mindstorm',
    '/muse',
    '/nope',
    '/orbit',
    '/pulse',
    '/search',
    '/settings',
    '/spark',
    '/stacks',
    '/stream',
    '/vault',
    '/about',
    '/features',
    '/pricing',
    '/privacy',
    '/terms',
    '/blog',
    '/changelog',
    '/roadmap',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Dynamic routes from BaseHub (blog posts)
  // Note: Cannot use draftMode() in sitemap, so we query directly without draft mode
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const client = basehubClient(false) // No draft mode for sitemap
    const result = await client.query({
      marketingSite: {
        blog: {
          items: {
            slug: true,
            publishedAt: true,
          },
        },
      },
    } as any) as {
      marketingSite?: {
        blog?: {
          items?: Array<{
            slug: string
            publishedAt: string | null
          }>
        }
      }
    }

    const blogPosts = result.marketingSite?.blog?.items || []
    blogRoutes = blogPosts
      .filter(post => post.publishedAt) // Only include published posts
      .map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
  } catch (error) {
    // Gracefully handle missing BASEHUB_TOKEN during build
    // Sitemap will still work with static routes
    console.warn('Failed to fetch blog posts for sitemap:', error)
  }

  return [...staticRoutes, ...blogRoutes]
}
