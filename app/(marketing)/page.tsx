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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  GraduationCap,
  Star,
  Code,
  Mail,
  Phone,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  MessageCircle,
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

        {/* Notes from Class Section */}
        <section className="container mx-auto px-6 py-20">
          <AnimatedSection className="space-y-12">
            <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <GraduationCap className="w-8 h-8 text-[var(--klutr-coral)]" />
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  Notes from Class
                </h2>
              </div>
              <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                Never forget what your teacher says
              </p>
            </AnimatedItem>
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedItem>
                <Card className="h-full border-[var(--klutr-outline)]/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">Math</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                      Basic arithmetic and introduction to variables.
                    </p>
                    <div className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] p-4 rounded-lg font-mono text-sm">
                      x = 20 y = -4
                      <br />
                      2x + 3y = ?
                    </div>
                  </CardContent>
                </Card>
              </AnimatedItem>
              <AnimatedItem>
                <Card className="h-full border-[var(--klutr-outline)]/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">Physics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                      Inertia is the natural tendency of objects in motion to
                      stay in motion.
                    </p>
                    <div className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] p-4 rounded-lg aspect-video flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Physics illustration
                      </p>
                    </div>
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
                <Link href="/login" aria-label="Try Notes from Class">
                  Try Now
                </Link>
              </Button>
            </AnimatedItem>
          </AnimatedSection>
        </section>

        {/* Trusted by Companies Section */}
        <section className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] py-16">
          <div className="container mx-auto px-6">
            <AnimatedFadeIn className="text-center space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
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
        <section className="container mx-auto px-6 py-20">
          <AnimatedSection className="space-y-12">
            <AnimatedItem className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
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
        <section className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] py-20">
          <div className="container mx-auto px-6">
            <AnimatedFadeIn className="max-w-4xl mx-auto text-center space-y-8">
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-[var(--klutr-coral)]/20 to-[var(--klutr-mint)]/20 rounded-2xl flex items-center justify-center">
                  <Code className="w-16 h-16 text-[var(--klutr-coral)]" />
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Ready to take your notes to the next level?
              </h2>
              <p className="text-lg md:text-xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 max-w-2xl mx-auto">
                Join thousands of users who are already clearing the clutr and
                keeping their spark alive.
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

        {/* Contact Form Section */}
        <section className="container mx-auto px-6 py-20">
          <AnimatedSection className="grid md:grid-cols-2 gap-12">
            <AnimatedItem className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm text-[var(--klutr-coral)] font-medium">
                  / get in touch /
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  We are always ready to help you and answer your question
                </h2>
              </div>
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                    Call Center
                  </h3>
                  <div className="space-y-2 text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      000 987 654 321
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      +(123) 456-789-876
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                    Email
                  </h3>
                  <p className="flex items-center gap-2 text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                    <Mail className="w-4 h-4" />
                    hello@klutr.com
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                    Social Network
                  </h3>
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)]"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)]"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)]"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)]"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)]"
                      aria-label="Discord"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedItem>
            <AnimatedItem>
              <Card className="border-[var(--klutr-outline)]/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Tell us your goals and what note taking means to you
                      </Label>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          className="border-[var(--klutr-outline)]/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-Mail</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="border-[var(--klutr-outline)]/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Your message..."
                          className="min-h-32 border-[var(--klutr-outline)]/30"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </AnimatedItem>
          </AnimatedSection>
        </section>

        {/* Beta CTA Banner */}
        <section className="bg-[var(--klutr-mint)] dark:bg-[var(--klutr-mint)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] py-16">
          <div className="container mx-auto px-6">
            <AnimatedFadeIn className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Free Beta now open
              </h2>
              <p className="text-lg md:text-xl opacity-90">
                Join early users and help shape the future of note-taking. No
                credit card required. Just dump your thoughts and watch the
                magic.
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
