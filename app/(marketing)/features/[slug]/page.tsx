import { getFeatureBySlug } from "@/lib/queries/features"
import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

/**
 * Generate static params for all features at build time
 * This enables ISR (Incremental Static Regeneration)
 */
export async function generateStaticParams() {
  try {
    const { getFeatures } = await import("@/lib/queries/features")
    const features = await getFeatures()
    return features.map((feature) => ({
      slug: feature.slug,
    }))
  } catch (error) {
    console.error("Error generating static params for features:", error)
    return []
  }
}

interface FeaturePageProps {
  params: Promise<{ slug: string }>
}

/**
 * Generate metadata for feature pages
 */
export async function generateMetadata({ params }: FeaturePageProps): Promise<Metadata> {
  const { slug } = await params
  const feature = await getFeatureBySlug(slug)

  if (!feature) {
    return {
      title: "Feature Not Found",
      description: "The feature you're looking for doesn't exist.",
    }
  }

  const title = `${feature.name} — ${feature.tagline} | Klutr`
  const description = feature.description || feature.tagline

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://klutr.app/features/${slug}`,
      siteName: "Klutr",
      images: feature.illustrationUrl
        ? [
            {
              url: feature.illustrationUrl.url,
              width: 1200,
              height: 630,
              alt: feature.illustrationUrl.altText || feature.name,
            },
          ]
        : [
            {
              url: "/og-image.png",
              width: 1200,
              height: 630,
              alt: feature.name,
            },
          ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: feature.illustrationUrl
        ? [feature.illustrationUrl.url]
        : ["/og-image.png"],
    },
    alternates: {
      canonical: `https://klutr.app/features/${slug}`,
    },
    keywords: feature.seoKeywords
      ? feature.seoKeywords.split(",").map((k) => k.trim())
      : undefined,
  }
}

/**
 * Dynamic feature page that fetches content from BaseHub
 * Supports draft mode for previewing unpublished content
 * Revalidates every 60 seconds
 */
export const revalidate = 60

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { slug } = await params

  try {
    const feature = await getFeatureBySlug(slug)

    if (!feature) {
      return (
        <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">Feature not found</h1>
            <p className="text-muted-foreground">
              The feature you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)]">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" asChild className="mb-8">
              <Link href="/#features" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Features
              </Link>
            </Button>

            <article className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  {feature.name}
                </h1>
                <p className="text-xl md:text-2xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                  {feature.tagline}
                </p>
              </div>

              {feature.illustrationUrl && (
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] border border-[var(--klutr-outline)]/20">
                  <img
                    src={feature.illustrationUrl.url}
                    alt={feature.illustrationUrl.altText || feature.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {feature.description && (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-[var(--klutr-text-primary-light)]/80 dark:text-[var(--klutr-text-primary-dark)]/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )}

              <div className="pt-8">
                <Button
                  size="lg"
                  className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
                  asChild
                >
                  <Link href="/login" aria-label={`Try ${feature.name}`}>
                    Try {feature.name}
                  </Link>
                </Button>
              </div>
            </article>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching feature from BaseHub:", error)
    return (
      <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Error loading feature</h1>
          <p className="text-muted-foreground">
            There was an error loading this feature. Please try again later.
          </p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }
}

