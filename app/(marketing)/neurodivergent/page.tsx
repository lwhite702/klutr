import { getPageMetadata } from "@/lib/queries/metadata";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Brain, Sparkles, Eye, BookOpen, Target, Heart } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMetadata("neurodivergent");

  const title = meta?.seoTitle ?? "For Neurodivergent Minds — Klutr";
  const description =
    meta?.metaDescription ??
    "Klutr is designed for neurodivergent minds. Low-friction capture, automatic sorting, and gentle resurfacing that works with your brain.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://klutr.app/neurodivergent",
      siteName: "Klutr",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Klutr for Neurodivergent Minds",
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
      canonical: "https://klutr.app/neurodivergent",
    },
  };
}

export const revalidate = 60;

export default async function NeurodivergentPage() {
  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      <MarketingHeader />

      <main>
        {/* Hero Section */}
        <AnimatedSection className="container mx-auto px-6 py-24">
          <AnimatedFadeIn className="text-center space-y-6 max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
              If your brain runs on sparks, you're home.
            </h1>
            <p className="text-xl md:text-2xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 leading-relaxed">
              Klutr is built for neurodivergent minds. We get that your brain works differently, and that's not a bug—it's a feature.
            </p>
          </AnimatedFadeIn>
        </AnimatedSection>

        {/* ADHD-Friendly Features */}
        <section className="container mx-auto px-6 py-16">
          <AnimatedSection className="space-y-12">
            <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Brain className="w-8 h-8 text-[var(--klutr-coral)]" />
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  ADHD-Friendly Features
                </h2>
              </div>
              <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                Low-friction capture means no decision paralysis. Just dump and go.
              </p>
            </AnimatedItem>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Zero setup friction",
                  description: "Start capturing immediately. No templates, no categories to choose from.",
                },
                {
                  title: "Automatic organization",
                  description: "We handle the sorting so you don't have to. Executive function support built in.",
                },
                {
                  title: "Quick rejection",
                  description: "Nope bin lets you reject without guilt. No second-guessing required.",
                },
                {
                  title: "Visual clustering",
                  description: "MindStorm shows patterns in color. See connections without reading everything.",
                },
                {
                  title: "Gentle resurfacing",
                  description: "Forgotten ideas come back when relevant. No pressure to remember everything.",
                },
                {
                  title: "Voice to structure",
                  description: "Speak your thoughts. We turn voice notes into searchable, organized content.",
                },
              ].map((feature, index) => (
                <AnimatedItem key={index}>
                  <Card className="h-full border-[var(--klutr-outline)]/20">
                    <CardHeader>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedItem>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* Autism-Friendly Structure */}
        <section className="container mx-auto px-6 py-16">
          <AnimatedSection className="space-y-12">
            <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Target className="w-8 h-8 text-[var(--klutr-mint)]" />
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  Autism-Friendly Structure
                </h2>
              </div>
              <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                Predictable patterns and clear organization without overwhelming complexity.
              </p>
            </AnimatedItem>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Consistent interface",
                  description: "Fintask-style layout that stays the same. No surprise changes or hidden features.",
                },
                {
                  title: "Clear visual hierarchy",
                  description: "Color-coded clusters and tags make information easy to scan and understand.",
                },
                {
                  title: "No social pressure",
                  description: "Private by default. Your notes stay yours. No sharing, no collaboration features to navigate.",
                },
                {
                  title: "Structured but flexible",
                  description: "Organization happens automatically, but you can customize when needed.",
                },
              ].map((feature, index) => (
                <AnimatedItem key={index}>
                  <Card className="h-full border-[var(--klutr-outline)]/20">
                    <CardHeader>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedItem>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* Dyslexia-Friendly Layouts */}
        <section className="container mx-auto px-6 py-16">
          <AnimatedSection className="space-y-12">
            <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Eye className="w-8 h-8 text-[var(--klutr-coral)]" />
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  Dyslexia-Friendly Layouts
                </h2>
              </div>
              <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                Visual organization reduces reading load. Find information without scanning walls of text.
              </p>
            </AnimatedItem>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Visual clustering",
                  description: "MindStorm shows related notes in color groups. Pattern recognition over text parsing.",
                },
                {
                  title: "Screenshot search",
                  description: "Upload images and screenshots. We extract and make them searchable without you typing.",
                },
                {
                  title: "Voice-first capture",
                  description: "Speak instead of type. We transcribe and organize your spoken thoughts.",
                },
                {
                  title: "Clear typography",
                  description: "Readable fonts and spacing. No cramped text or overwhelming walls of words.",
                },
              ].map((feature, index) => (
                <AnimatedItem key={index}>
                  <Card className="h-full border-[var(--klutr-outline)]/20">
                    <CardHeader>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedItem>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* Executive Function Support */}
        <section className="container mx-auto px-6 py-16">
          <AnimatedSection className="space-y-12">
            <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-[var(--klutr-mint)]" />
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  Executive Function Support
                </h2>
              </div>
              <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                We handle the organizational overhead so you can focus on what matters.
              </p>
            </AnimatedItem>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Automatic tagging",
                  description: "No need to categorize. We identify themes and group related notes automatically.",
                },
                {
                  title: "No perfect system pressure",
                  description: "There's no "right" way to use Klutr. Dump everything and we'll figure it out.",
                },
                {
                  title: "Gentle reminders",
                  description: "Insights resurface forgotten ideas. No nagging, just helpful nudges.",
                },
                {
                  title: "Micro-momentum",
                  description: "Daily wins tracking. See your progress without overwhelming metrics.",
                },
              ].map((feature, index) => (
                <AnimatedItem key={index}>
                  <Card className="h-full border-[var(--klutr-outline)]/20">
                    <CardHeader>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedItem>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* Design Principles */}
        <section className="container mx-auto px-6 py-16">
          <AnimatedSection className="space-y-12">
            <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-[var(--klutr-coral)]" />
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  Design Principles for Chaotic Brains
                </h2>
              </div>
              <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                Every decision we make is informed by how neurodivergent minds actually work.
              </p>
            </AnimatedItem>
            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  principle: "Low friction > perfect systems",
                  explanation: "We'd rather you capture 10 messy notes than spend 10 minutes setting up the perfect folder structure.",
                },
                {
                  principle: "Automatic > manual",
                  explanation: "If we can do it automatically, we will. Your brain has better things to focus on.",
                },
                {
                  principle: "Gentle > aggressive",
                  explanation: "Resurfacing is helpful, not pushy. Insights appear when relevant, not on a schedule.",
                },
                {
                  principle: "Visual > textual",
                  explanation: "Color, patterns, and visual clustering help you see connections without reading everything.",
                },
                {
                  principle: "Private > social",
                  explanation: "Your notes are yours. No sharing features, no collaboration pressure, no social anxiety.",
                },
              ].map((item, index) => (
                <AnimatedItem key={index}>
                  <Card className="border-[var(--klutr-outline)]/20">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                        {item.principle}
                      </h3>
                      <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                        {item.explanation}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedItem>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* CTA Section */}
        <section className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] py-28">
          <div className="container mx-auto px-6">
            <AnimatedFadeIn className="max-w-3xl mx-auto text-center space-y-10">
              <div className="flex justify-center mb-10">
                <div className="w-40 h-40 bg-gradient-to-br from-[var(--klutr-coral)]/20 to-[var(--klutr-mint)]/20 rounded-3xl flex items-center justify-center shadow-lg">
                  <Heart className="w-20 h-20 text-[var(--klutr-coral)]" />
                </div>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] leading-tight">
                Try Klutr Free
              </h2>
              <p className="text-xl md:text-2xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 max-w-2xl mx-auto leading-relaxed">
                Join neurodivergent users who've found a note-taking system that actually works with their brains.
              </p>
              <Button
                size="lg"
                className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white text-lg px-8 py-6 rounded-full"
                asChild
              >
                <Link href="/login" aria-label="Try Klutr free">
                  Get Started Free
                </Link>
              </Button>
            </AnimatedFadeIn>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

