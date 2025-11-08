import { getLegalPage } from '@/lib/queries/legal'
import type { Metadata } from 'next'
import { marked } from 'marked'
import MarketingHeader from '@/components/marketing/MarketingHeader'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export const revalidate = 86400 // Revalidate daily

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('privacy')

  return {
    title: page?.title ?? 'Privacy Policy | Klutr',
    description: 'Privacy policy for Klutr. Learn how we protect your data and respect your privacy.',
    openGraph: {
      title: page?.title ?? 'Privacy Policy | Klutr',
      description: 'Privacy policy for Klutr. Learn how we protect your data and respect your privacy.',
      url: 'https://klutr.app/privacy',
      siteName: 'Klutr',
    },
  }
}

export default async function PrivacyPolicyPage() {
  const page = await getLegalPage('privacy')

  // Convert markdown to HTML if content exists
  const htmlContent = page?.content
    ? await marked(page.content, {
        breaks: true,
        gfm: true,
      })
    : ''

  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      <MarketingHeader />

      <main>
        <section className="max-w-4xl mx-auto py-24 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            {page?.title ?? 'Privacy Policy'}
          </h1>

          {htmlContent ? (
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-[var(--klutr-text-primary-light)] dark:prose-headings:text-[var(--klutr-text-primary-dark)] prose-p:text-[var(--klutr-text-primary-light)]/80 dark:prose-p:text-[var(--klutr-text-primary-dark)]/80 prose-a:text-[var(--klutr-coral)] hover:prose-a:text-[var(--klutr-coral)]/80 prose-strong:text-[var(--klutr-text-primary-light)] dark:prose-strong:text-[var(--klutr-text-primary-dark)]"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                Privacy policy content will be available soon.
              </p>
            </div>
          )}

          {page?.lastUpdated && (
            <p className="text-sm text-[var(--klutr-text-primary-light)]/50 dark:text-[var(--klutr-text-primary-dark)]/50 mt-12 pt-8 border-t border-[var(--klutr-outline)]/20">
              Last updated:{' '}
              {new Date(page.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}

