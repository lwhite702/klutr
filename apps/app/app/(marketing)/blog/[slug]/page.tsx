import { getBlogPost, getBlogPosts } from '@/lib/queries/blog'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { marked } from 'marked'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import MarketingHeader from '@/components/marketing/MarketingHeader'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import { getLatestChangelogEntries, getUpcomingRoadmapItems } from '@/lib/queries'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts()
    return posts.map((post) => ({ slug: post.slug }))
  } catch (error) {
    console.error("Error generating static params for blog:", error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt ?? undefined,
      url: `https://klutr.app/blog/${post.slug}`,
      siteName: 'Klutr',
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return notFound()
  }

  // Convert markdown to HTML if content exists
  const htmlContent = post.content
    ? await marked(post.content, {
        breaks: true,
        gfm: true,
      })
    : ''

  // Fetch footer data
  const [latestReleases, upcomingItems] = await Promise.all([
    getLatestChangelogEntries(2),
    getUpcomingRoadmapItems(2),
  ])

  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      <MarketingHeader />

      <main>
        <article className="max-w-3xl mx-auto py-24 px-6">
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                {post.title}
              </h1>
              <div className="flex items-center gap-4">
                {post.category && (
                  <span className="text-sm px-3 py-1 rounded-full bg-[var(--klutr-coral)]/10 text-[var(--klutr-coral)]">
                    {post.category}
                  </span>
                )}
                {post.publishedAt && (
                  <p className="text-sm text-[var(--klutr-text-primary-light)]/50 dark:text-[var(--klutr-text-primary-dark)]/50">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>

            {htmlContent && (
              <div
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-[var(--klutr-text-primary-light)] dark:prose-headings:text-[var(--klutr-text-primary-dark)] prose-p:text-[var(--klutr-text-primary-light)]/80 dark:prose-p:text-[var(--klutr-text-primary-dark)]/80 prose-a:text-[var(--klutr-coral)] hover:prose-a:text-[var(--klutr-coral)]/80 prose-strong:text-[var(--klutr-text-primary-light)] dark:prose-strong:text-[var(--klutr-text-primary-dark)]"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            )}

            {!htmlContent && post.excerpt && (
              <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                {post.excerpt}
              </p>
            )}
          </div>
        </article>
      </main>

      <MarketingFooter latestReleases={latestReleases} upcomingItems={upcomingItems} />
    </div>
  )
}

