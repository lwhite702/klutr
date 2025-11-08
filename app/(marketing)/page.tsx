import { getHomePage, getFeatures } from "@/lib/queries"
import { getPageMetadata } from "@/lib/queries/metadata"
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
  GraduationCap,
  Star,
  Code,
} from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMetadata("home")

  return {
    title: meta?.seoTitle ?? "Klutr — AI Note App That Brings Order to Your Chaos",
    description:
      meta?.metaDescription ??
      "Capture everything, organize it effortlessly, and discover insights with AI. Klutr transforms your notes into meaning. Free beta now open.",
    openGraph: {
      title: meta?.seoTitle ?? "Klutr — AI Note App That Brings Order to Your Chaos",
      description:
        meta?.metaDescription ??
        "Capture everything, organize it effortlessly, and discover insights with AI. Klutr transforms your notes into meaning. Free beta now open.",
      url: "https://klutr.app",
      siteName: "Klutr",
      images: ["/og-image.png"],
    },
  }
}

export default async function MarketingHomePage() {
  const home = await getHomePage()
  const features = await getFeatures()

  // Fallback data if BaseHub is unavailable
  const homeData = home || {
    heroHeadline: "Clear the clutr. Keep the spark.",
    heroSubtext:
      "Klutr is the frictionless inbox for your brain. Dump text, images, or voice notes and we'll organize them into searchable piles so you can stay creative and clutter-free.",
    primaryCTA: "Try for Free",
    secondaryCTA: null,
  }

  const testimonials = [
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

        {/* How It Works Section */}
        <section className="container mx-auto px-6 py-24">
          <AnimatedSection className="space-y-16">
            <AnimatedItem className="text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] leading-tight">
                Bring order to your chaos
              </h2>
              <p className="text-xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 leading-relaxed">
                Dump notes, ideas & randomness; we'll sort 'em faster than you can say 'where's that screenshot?'
              </p>
            </AnimatedItem>
            <div className="grid md:grid-cols-3 gap-6">
              <AnimatedItem>
                <Card className="h-full border-[var(--klutr-outline)]/20 hover:border-[var(--klutr-coral)]/30 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-2xl">Dump it like it's hot</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                      Capture text, images, or voice notes. No friction, no judgment. Just dump your thoughts.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedItem>
              <AnimatedItem>
                <Card className="h-full border-[var(--klutr-outline)]/20 hover:border-[var(--klutr-coral)]/30 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-2xl">Watch AI do its thing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                      Our AI instantly organizes your notes into searchable piles. No setup, no configuration.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedItem>
              <AnimatedItem>
                <Card className="h-full border-[var(--klutr-outline)]/20 hover:border-[var(--klutr-coral)]/30 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-2xl">Revisit your gems</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                      Find forgotten ideas when you need them. Your notes resurface at the right moment.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedItem>
            </div>
          </AnimatedSection>
        </section>

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
                Ready to clear the clutr?
              </h2>
              <p className="text-xl md:text-2xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 max-w-2xl mx-auto leading-relaxed">
                Join early users who are already freeing their minds from digital clutter. Capture effortlessly, organize automatically, stay creative.
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
        <section className="bg-[var(--klutr-mint)] dark:bg-[var(--klutr-mint)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] py-24">
          <div className="container mx-auto px-6">
            <AnimatedFadeIn className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] leading-tight">
                Free Beta now open
              </h2>
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                Join early users and help shape the future of note-taking. No credit card required. Just dump your thoughts and watch the magic.
              </p>
              <Button
                size="lg"
                className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
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

      <MarketingFooter />
    </div>
  )
}
