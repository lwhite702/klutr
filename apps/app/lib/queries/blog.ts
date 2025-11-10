import { basehubClient } from '../basehub'
import { getSafeDraftMode } from '../utils/draft-mode'

export interface BlogPost {
  _id: string
  _title: string
  title: string
  slug: string
  category: string | null
  excerpt: string | null
  publishedAt: string | null
  seoTitle: string | null
  metaDescription: string | null
  content: string | null
  brandTag: string | null
}

/**
 * Fetch all blog posts from BaseHub
 * Supports draft mode for previewing unpublished content
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const isEnabled = await getSafeDraftMode()
    const client = basehubClient(isEnabled)

    const result = await client.query({
      marketingSite: {
        blog: {
          items: {
            _id: true,
            _title: true,
            title: true,
            slug: true,
            category: true,
            excerpt: true,
            publishedAt: true,
          },
        },
      },
    }) as {
      marketingSite?: {
        blog?: {
          items?: Array<{
            _id: string
            _title: string
            title: string
            slug: string
            category: string | null
            excerpt: string | null
            publishedAt: string | null
          }>
        }
      }
    }

    const marketingSite = result.marketingSite

    const posts = marketingSite?.blog?.items || []

    return posts
      .map((post: any) => ({
        _id: post._id || '',
        _title: post._title || post.title || '',
        title: post.title || '',
        slug: post.slug || '',
        category: post.category || null,
        excerpt: post.excerpt || null,
        publishedAt: post.publishedAt || null,
        seoTitle: null,
        metaDescription: null,
        content: null,
        brandTag: null,
      }))
      .filter((post: BlogPost) => post.publishedAt) // Only show published posts
      .sort((a: BlogPost, b: BlogPost) => {
        // Sort by published date, newest first
        if (!a.publishedAt || !b.publishedAt) return 0
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      })
  } catch (error) {
    console.error('Error fetching blog posts from BaseHub:', error)
    return []
  }
}

/**
 * Fetch a single blog post by slug from BaseHub
 * Supports draft mode for previewing unpublished content
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const isEnabled = await getSafeDraftMode()
    const client = basehubClient(isEnabled)

    const result = await client.query({
      marketingSite: {
        blog: {
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
            category: true,
            excerpt: true,
            publishedAt: true,
            seoTitle: true,
            metaDescription: true,
            content: {
              plainText: true,
            },
            brandTag: true,
          },
        },
      },
    }) as {
      marketingSite?: {
        blog?: {
          items?: Array<{
            _id: string
            _title: string
            title: string
            slug: string
            category: string | null
            excerpt: string | null
            publishedAt: string | null
            seoTitle: string | null
            metaDescription: string | null
            content?: { plainText?: string }
            brandTag: string | null
          }>
        }
      }
    }

    const marketingSite = result.marketingSite

    const post = marketingSite?.blog?.items?.[0]

    if (!post) {
      return null
    }

    return {
      _id: post._id || '',
      _title: post._title || post.title || '',
      title: post.title || '',
      slug: post.slug || '',
      category: post.category || null,
      excerpt: post.excerpt || null,
      publishedAt: post.publishedAt || null,
      seoTitle: post.seoTitle || null,
      metaDescription: post.metaDescription || null,
      content: post.content?.plainText || null,
      brandTag: post.brandTag || null,
    }
  } catch (error) {
    console.error('Error fetching blog post from BaseHub:', error)
    return null
  }
}

