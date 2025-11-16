import { getPageMetadata } from "@/lib/queries/metadata";
import { getAboutContent } from "@/lib/basehub/queries/pages";
import type { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import {
  AnimatedSection,
  AnimatedFadeIn,
  AnimatedItem,
} from "@/components/marketing/AnimatedSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Lightbulb, Target, Heart } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMetadata("about");

  const title = meta?.seoTitle ?? "About — Klutr";
  const description =
    meta?.metaDescription ??
    "Klutr is a practical, clever note-taking app that helps you organize your chaos. Built for forward-thinking people who value clarity.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://klutr.app/about",
      siteName: "Klutr",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "About Klutr",
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
    },
    alternates: {
      canonical: "https://klutr.app/about",
    },
  };
}

export const revalidate = 60;

export default async function AboutPage() {
  const aboutContent = await getAboutContent();

  // Use BaseHub aboutBlock if available, otherwise use fallback content
  const aboutData = aboutContent.aboutBlock || {
    headline: "About Klutr",
    story: "Klutr exists to help you turn chaos into clarity. We believe that everyone has brilliant ideas, but they get lost in the noise. Our mission is to give you a frictionless way to capture everything—text, voice, images, files—and let AI handle the organization so you can stay creative.",
    image: null,
  };

  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      <MarketingHeader />

      <main>
        <AnimatedSection className="container mx-auto px-6 py-24">
          <AnimatedFadeIn className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Lightbulb className="w-8 h-8 text-[var(--klutr-coral)] lightbulb-glow" />
              <h1 className="text-4xl md:text-5xl font-display font-bold">
                {aboutData.headline || "About Klutr"}
              </h1>
            </div>
            {aboutData.story && (
              <p className="text-xl font-body text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                {aboutData.story.split('\n')[0]}
              </p>
            )}
          </AnimatedFadeIn>

          <div className="max-w-4xl mx-auto space-y-12">
            {aboutData.story && (
              <AnimatedItem className="space-y-6">
                <h2 className="text-3xl font-display font-bold">Our Mission</h2>
                <p className="text-lg font-body leading-relaxed text-[var(--klutr-text-primary-light)]/80 dark:text-[var(--klutr-text-primary-dark)]/80">
                  {aboutData.story}
                </p>
              </AnimatedItem>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              <AnimatedItem>
                <Card className="h-full border-[var(--klutr-outline)]/20 rounded-2xl shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-2xl bg-[var(--klutr-coral)]/10 flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-[var(--klutr-coral)]" />
                    </div>
                    <CardTitle className="font-display">Practical</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-body">
                      We solve real problems. No hype, no fluff. Just tools that
                      work when you need them.
                    </CardDescription>
                  </CardContent>
                </Card>
              </AnimatedItem>

              <AnimatedItem>
                <Card className="h-full border-[var(--klutr-outline)]/20 rounded-2xl shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-2xl bg-[var(--klutr-mint)]/10 flex items-center justify-center mb-4">
                      <Lightbulb className="w-6 h-6 text-[var(--klutr-mint)]" />
                    </div>
                    <CardTitle className="font-display">Clever</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-body">
                      Smart automation that learns from you. AI that actually
                      helps, not just buzzwords.
                    </CardDescription>
                  </CardContent>
                </Card>
              </AnimatedItem>

              <AnimatedItem>
                <Card className="h-full border-[var(--klutr-outline)]/20 rounded-2xl shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--klutr-coral)]/10 to-[var(--klutr-mint)]/10 flex items-center justify-center mb-4">
                      <Heart className="w-6 h-6 text-[var(--klutr-coral)]" />
                    </div>
                    <CardTitle className="font-display">Calm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-body">
                      We reduce stress, not add to it. A calm interface that
                      helps you think clearly.
                    </CardDescription>
                  </CardContent>
                </Card>
              </AnimatedItem>
            </div>

            <AnimatedItem className="space-y-6">
              <h2 className="text-3xl font-display font-bold">Brand Voice</h2>
              <p className="text-lg font-body leading-relaxed text-[var(--klutr-text-primary-light)]/80 dark:text-[var(--klutr-text-primary-dark)]/80">
                Klutr speaks like a supportive mentor who codes. We're
                practical, clever, and lightly humorous—because organizing your
                thoughts shouldn't feel like work. We write like we're
                explaining something to a smart colleague who's new to the
                project. No condescension, no hype, just clear guidance that
                helps you succeed.
              </p>
              <p className="text-lg font-body leading-relaxed text-[var(--klutr-text-primary-light)]/80 dark:text-[var(--klutr-text-primary-dark)]/80">
                Our tone is helpful, forward-thinking, and calm. We believe in
                "smart chaos"—the idea that brilliant ideas often start messy,
                and that's okay. We're here to help you find the clarity in the
                chaos.
              </p>
            </AnimatedItem>

            {/* Use BaseHub ctaBlock if available, otherwise use fallback */}
            {aboutContent.ctaBlock ? (
              <AnimatedFadeIn className="text-center space-y-6 pt-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold">
                  {aboutContent.ctaBlock.headline || "Ready to organize your chaos?"}
                </h2>
                {aboutContent.ctaBlock.ctaText && (
                  <Button
                    size="lg"
                    className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white text-lg px-8 py-6 rounded-2xl shadow-xl"
                    asChild
                  >
                    <Link href={aboutContent.ctaBlock.ctaLink || "/login"} aria-label={aboutContent.ctaBlock.ctaText}>
                      {aboutContent.ctaBlock.ctaText}
                    </Link>
                  </Button>
                )}
              </AnimatedFadeIn>
            ) : (
              <AnimatedFadeIn className="text-center space-y-6 pt-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold">
                  Ready to organize your chaos?
                </h2>
                <p className="text-lg font-body text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                  Join early users who are already freeing their minds from
                  digital clutter.
                </p>
                <Button
                  size="lg"
                  className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white text-lg px-8 py-6 rounded-2xl shadow-xl"
                  asChild
                >
                  <Link href="/login" aria-label="Get started with Klutr">
                    Get Started Free
                  </Link>
                </Button>
              </AnimatedFadeIn>
            )}
          </div>
        </AnimatedSection>
      </main>

      <MarketingFooter />
    </div>
  );
}
