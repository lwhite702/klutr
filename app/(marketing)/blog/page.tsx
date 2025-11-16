import { getBlogPosts } from '@/lib/queries/blog'
import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingHeader from '@/components/marketing/MarketingHeader'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Klutr Blog — Thoughts on AI, Creativity, and Clarity',
  description:
    'Articles on thinking, AI, and digital creativity from the Klutr team.',
  openGraph: {
    title: 'Klutr Blog — Thoughts on AI, Creativity, and Clarity',
    description:
      'Articles on thinking, AI, and digital creativity from the Klutr team.',
    url: 'https://klutr.app/blog',
    siteName: 'Klutr',
  },
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  

  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      <MarketingHeader />

      <main>
        <section className="max-w-4xl mx-auto py-24 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            The Klutr Blog
          </h1>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                No blog posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="border-b border-[var(--klutr-outline)]/20 pb-6 last:border-b-0"
                >
                  <h2 className="text-2xl md:text-3xl font-semibold mb-2 hover:text-[var(--klutr-coral)] transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {post.excerpt && (
                    <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 mb-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-4">
                    {post.category && (
                      <span className="text-sm px-3 py-1 rounded-full bg-[var(--klutr-coral)]/10 text-[var(--klutr-coral)]">
                        {post.category}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="text-sm text-[var(--klutr-text-primary-light)]/50 dark:text-[var(--klutr-text-primary-dark)]/50">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                    </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}

