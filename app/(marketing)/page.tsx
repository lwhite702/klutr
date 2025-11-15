import { getHomePage, getFeatures, getLatestChangelogEntries, getUpcomingRoadmapItems } from "@/lib/queries"
import { getPageMetadata } from "@/lib/queries/metadata"
import { getHomeContent } from "@/lib/basehub/queries/pages"
import type { Metadata } from "next"
import MarketingHeader from "@/components/marketing/MarketingHeader"
import MarketingFooter from "@/components/marketing/MarketingFooter"
import Hero from "@/components/marketing/Hero"
import FeatureGrid from "@/components/marketing/FeatureGrid"
import {
  AnimatedSection,
  AnimatedItem,
  AnimatedFadeIn,
} from "@/components/marketing/AnimatedSection"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sparkles,
  Star,
  Code,
  Zap,
  Layers,
  Search,
} from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMetadata("home")

  const title = meta?.seoTitle ?? "Klutr — AI Note App That Brings Order to Your Chaos"
  const description =
    meta?.metaDescription ??
    "Capture everything, organize it effortlessly, and discover insights with AI. Klutr transforms your notes into meaning. Free beta now open."

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://klutr.app",
      siteName: "Klutr",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Klutr — Organize Your Chaos",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
      creator: "@klutr",
    },
    alternates: {
      canonical: "https://klutr.app",
    },
  }
}

export const revalidate = 60

export default async function MarketingHomePage() {
  // Fetch BaseHub content
  const homeContent = await getHomeContent()
  const home = await getHomePage()
  const features = await getFeatures()
  
  // Fetch footer data
  const [latestReleases, upcomingItems] = await Promise.all([
    getLatestChangelogEntries(2),
    getUpcomingRoadmapItems(2),
  ])

  // Use BaseHub heroBlock if available, otherwise fallback to existing getHomePage()
  const heroData = homeContent.heroBlock || {
    title: home?.heroHeadline || "Organize Your Chaos",
    subtitle: home?.heroSubtext || "Klutr is a conversational workspace where all your input—text, voice, images, files—flows naturally through a Stream interface and gets automatically organized on the backend. Drop your thoughts like messages in a chat, and we'll handle the rest.",
    ctaText: home?.primaryCTA || "Try for Free",
    ctaLink: "/login",
    image: null,
  }

  // Fallback data if BaseHub is unavailable
  const homeData = {
    heroHeadline: heroData.title,
    heroSubtext: heroData.subtitle,
    primaryCTA: heroData.ctaText,
    secondaryCTA: null,
  }

  // Use BaseHub testimonialBlock if available, otherwise fallback to hardcoded testimonials
  const testimonials = homeContent.testimonialBlock
    ? [
        {
          name: homeContent.testimonialBlock.author || "User",
          username: homeContent.testimonialBlock.role || "",
          text: homeContent.testimonialBlock.quote || "",
          rating: 5,
          date: new Date().toLocaleDateString(),
        },
      ]
    : [
        {
          name: "Jason",
          username: "@jasonbaldmen",
          text: "The goal is to make the website easy to use for the user and drive the necessary growth.",
          rating: 4,
          date: "12 January 2015",
        },
        {
          name: "Morgan",
          username: "@morganNotFreeMan",
          text: "Klutr is a simple, intuitive note-taking app that keeps everything organized and easy to access. Perfect for boosting productivity!",
          rating: 3,
          date: "12 January 2015",
        },
        {
          name: "Daniel",
          username: "@Daniel3Oscar",
          text: "Klutr is a sleek, user-friendly app that makes organizing notes effortless. It's perfect for staying on top of tasks and ideas!",
          rating: 5,
          date: "12 January 2015",
        },
      ]

  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      <MarketingHeader />

      <main>
        <Hero
          heroHeadline={homeData.heroHeadline}
          heroSubtext={homeData.heroSubtext}
          primaryCTA={homeData.primaryCTA}
          secondaryCTA={homeData.secondaryCTA}
        />

        <FeatureGrid features={features} />

        {/* How It Works Section - Use BaseHub howItWorksBlock if available */}
        {homeContent.howItWorksBlock ? (
          <section className="container mx-auto px-6 py-20">
            <AnimatedSection className="space-y-12">
              <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8 text-[var(--klutr-coral)]" />
                  <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                    {homeContent.howItWorksBlock.heading || "How It Works"}
                  </h2>
                </div>
              </AnimatedItem>
              <div className="grid md:grid-cols-2 gap-6">
                {homeContent.howItWorksBlock.steps.map((step, index) => (
                  <AnimatedItem key={index}>
                    <Card className="h-full border-[var(--klutr-outline)]/20">
                      <CardHeader>
                        {step.icon && (
                          <div className="w-12 h-12 rounded-lg bg-[var(--klutr-coral)]/10 flex items-center justify-center mb-4">
                            <img
                              src={step.icon.url}
                              alt={step.icon.altText || step.title || ""}
                              className="w-6 h-6"
                            />
                          </div>
                        )}
                        <CardTitle className="text-2xl">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  </AnimatedItem>
                ))}
              </div>
            </AnimatedSection>
          </section>
        ) : (
          <section className="container mx-auto px-6 py-20">
            <AnimatedSection className="space-y-12">
              <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8 text-[var(--klutr-coral)]" />
                  <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                    How It Works
                  </h2>
                </div>
                <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                  Drop, tag, board, discover—effortlessly
                </p>
              </AnimatedItem>
              <div className="grid md:grid-cols-2 gap-6">
                <AnimatedItem>
                  <Card className="h-full border-[var(--klutr-outline)]/20">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-[var(--klutr-coral)]/10 flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-[var(--klutr-coral)]" />
                      </div>
                      <CardTitle className="text-2xl">Drop</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                        Add notes, files, or voice recordings to your Stream. Chat-style interface, zero friction.
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedItem>
                <AnimatedItem>
                  <Card className="h-full border-[var(--klutr-outline)]/20">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-[var(--klutr-mint)]/10 flex items-center justify-center mb-4">
                        <Layers className="w-6 h-6 text-[var(--klutr-mint)]" />
                      </div>
                      <CardTitle className="text-2xl">Organize</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                        AI automatically tags your drops and groups them into Boards. No manual filing required.
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedItem>
                <AnimatedItem>
                  <Card className="h-full border-[var(--klutr-outline)]/20">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-[var(--klutr-coral)]/10 flex items-center justify-center mb-4">
                        <Search className="w-6 h-6 text-[var(--klutr-coral)]" />
                      </div>
                      <CardTitle className="text-2xl">Discover</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                        Muse provides weekly insights. Search finds connections. Turn chaos into clarity.
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedItem>
              </div>
              <AnimatedItem className="text-center pt-4">
                <Button
                  size="lg"
                  className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
                  asChild
                >
                  <Link href="/login" aria-label="Get started with Klutr">
                    Get Started
                  </Link>
                </Button>
              </AnimatedItem>
            </AnimatedSection>
          </section>
        )}

        {/* Trusted by Companies Section */}
        <section className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] py-20">
          <div className="container mx-auto px-6">
            <AnimatedFadeIn className="text-center space-y-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Trusted by Companies
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-9 w-24 bg-[var(--klutr-text-primary-light)]/20 dark:bg-[var(--klutr-text-primary-dark)]/20 rounded"
                  />
                ))}
              </div>
            </AnimatedFadeIn>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-6 py-24">
          <AnimatedSection className="space-y-16">
            <AnimatedItem className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                What users say
              </h2>
            </AnimatedItem>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <AnimatedItem key={index}>
                  <Card className="h-full border-[var(--klutr-outline)]/20">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-[var(--klutr-coral)]/20 flex items-center justify-center">
                          <span className="text-xl font-bold text-[var(--klutr-coral)]">
                            {testimonial.name[0]}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {testimonial.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.username}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                        {testimonial.text}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? "fill-[var(--klutr-coral)] text-[var(--klutr-coral)]"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.date}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedItem>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* Large CTA Section */}
        <section className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] py-28">
          <div className="container mx-auto px-6">
            <AnimatedFadeIn className="max-w-4xl mx-auto text-center space-y-10">
              <div className="flex justify-center mb-10">
                <div className="w-40 h-40 bg-gradient-to-br from-[var(--klutr-coral)]/20 to-[var(--klutr-mint)]/20 rounded-3xl flex items-center justify-center shadow-lg">
                  <Code className="w-20 h-20 text-[var(--klutr-coral)]" />
                </div>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] leading-tight">
                Ready to organize your chaos?
              </h2>
              <p className="text-xl md:text-2xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 max-w-2xl mx-auto leading-relaxed">
                Join early users who are already freeing their minds from digital clutter. Drop your thoughts, let AI organize, stay creative.
              </p>
              <Button
                size="lg"
                className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white text-lg px-8 py-6 rounded-full"
                asChild
              >
                <Link href="/login" aria-label="Get started with Klutr">
                  Try Now
                </Link>
              </Button>
            </AnimatedFadeIn>
          </div>
        </section>

        {/* Help & Support Section */}
        <section className="container mx-auto px-6 py-24">
          <AnimatedSection className="max-w-3xl mx-auto text-center space-y-10">
            <AnimatedItem className="space-y-6">
              <p className="text-sm text-[var(--klutr-coral)] font-medium uppercase tracking-wider">
                / need help? /
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] leading-tight">
                Questions? We've got answers
              </h2>
              <p className="text-xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 max-w-2xl mx-auto leading-relaxed">
                Find guides, tutorials, and answers in our Help Center. Everything you need to get the most out of Klutr.
              </p>
            </AnimatedItem>
            <AnimatedItem>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
                  asChild
                >
                  <Link href="/help" aria-label="Visit Help Center">
                    Visit Help Center
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[var(--klutr-outline)]/30"
                  asChild
                >
                  <Link href="/docs" aria-label="View Documentation">
                    View Documentation
                  </Link>
                </Button>
              </div>
            </AnimatedItem>
          </AnimatedSection>
        </section>

        {/* Beta CTA Banner */}
        <section className="bg-accent-mint dark:bg-accent-mint py-24">
          <div className="container mx-auto px-6">
            <AnimatedFadeIn className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-primary">
                Free Beta now open
              </h2>
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed text-primary">
                Join early users and help shape the future of note-taking. No credit card required. Just drop your thoughts into the Stream and watch the magic.
              </p>
              <Button
                size="lg"
                className="bg-accent-coral hover:bg-accent-coral/90 text-white"
                asChild
              >
                <Link href="/login" aria-label="Get started with free beta">
                  Get Started Free
                </Link>
              </Button>
            </AnimatedFadeIn>
          </div>
        </section>
      </main>

      <MarketingFooter latestReleases={latestReleases} upcomingItems={upcomingItems} />
    </div>
  )
}
