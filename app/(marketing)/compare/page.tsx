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
import { Check, X } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMetadata("compare");

  const title = meta?.seoTitle ?? "Compare Klutr — Why We Work for Chaotic Minds";
  const description =
    meta?.metaDescription ??
    "See how Klutr differs from Notion, Apple Notes, and Mem. Built for neurodivergent minds who need low-friction capture and automatic organization.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://klutr.app/compare",
      siteName: "Klutr",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Compare Klutr",
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
      canonical: "https://klutr.app/compare",
    },
  };
}

export const revalidate = 60;

const comparisonFeatures = [
  {
    feature: "Zero setup required",
    klutr: true,
    notion: false,
    appleNotes: true,
    mem: false,
  },
  {
    feature: "Low-friction capture",
    klutr: true,
    notion: false,
    appleNotes: true,
    mem: true,
  },
  {
    feature: "Automatic organization",
    klutr: true,
    notion: false,
    appleNotes: false,
    mem: true,
  },
  {
    feature: "Rejection workflow (Nope bin)",
    klutr: true,
    notion: false,
    appleNotes: false,
    mem: false,
  },
  {
    feature: "Visual clustering (MindStorm)",
    klutr: true,
    notion: false,
    appleNotes: false,
    mem: false,
  },
  {
    feature: "Local-first privacy",
    klutr: true,
    notion: false,
    appleNotes: true,
    mem: false,
  },
  {
    feature: "ND-friendly microcopy",
    klutr: true,
    notion: false,
    appleNotes: false,
    mem: false,
  },
  {
    feature: "Voice → structure",
    klutr: true,
    notion: false,
    appleNotes: true,
    mem: true,
  },
  {
    feature: "Screenshots → searchable",
    klutr: true,
    notion: false,
    appleNotes: false,
    mem: true,
  },
  {
    feature: "Gentle resurfacing",
    klutr: true,
    notion: false,
    appleNotes: false,
    mem: true,
  },
  {
    feature: "No perfect system pressure",
    klutr: true,
    notion: false,
    appleNotes: true,
    mem: false,
  },
  {
    feature: "Predictable interface",
    klutr: true,
    notion: false,
    appleNotes: true,
    mem: false,
  },
];

export default async function ComparePage() {
  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      <MarketingHeader />

      <main>
        {/* Hero Section */}
        <AnimatedSection className="container mx-auto px-6 py-24">
          <AnimatedFadeIn className="text-center space-y-6 max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
              Why Klutr works for chaotic minds
            </h1>
            <p className="text-xl md:text-2xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 leading-relaxed">
              See how we differ from Notion, Apple Notes, and Mem. Built for neurodivergent minds who need low-friction capture and automatic organization.
            </p>
          </AnimatedFadeIn>
        </AnimatedSection>

        {/* Comparison Table */}
        <section className="container mx-auto px-6 py-16">
          <AnimatedSection>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[var(--klutr-outline)]/30">
                    <th className="text-left p-4 font-semibold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                      Feature
                    </th>
                    <th className="text-center p-4 font-semibold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                      Klutr
                    </th>
                    <th className="text-center p-4 font-semibold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                      Notion
                    </th>
                    <th className="text-center p-4 font-semibold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                      Apple Notes
                    </th>
                    <th className="text-center p-4 font-semibold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                      Mem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-[var(--klutr-outline)]/20 hover:bg-[var(--klutr-surface-light)]/50 dark:hover:bg-[var(--klutr-surface-dark)]/50 transition-colors"
                    >
                      <td className="p-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                        {item.feature}
                      </td>
                      <td className="p-4 text-center">
                        {item.klutr ? (
                          <Check className="w-5 h-5 text-[var(--klutr-mint)] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {item.notion ? (
                          <Check className="w-5 h-5 text-[var(--klutr-mint)] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {item.appleNotes ? (
                          <Check className="w-5 h-5 text-[var(--klutr-mint)] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {item.mem ? (
                          <Check className="w-5 h-5 text-[var(--klutr-mint)] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </section>

        {/* Key Differentiators */}
        <section className="container mx-auto px-6 py-16">
          <AnimatedSection className="space-y-12">
            <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                What makes Klutr different
              </h2>
              <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                We're not trying to be everything to everyone. We're built specifically for chaotic minds.
              </p>
            </AnimatedItem>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Zero setup",
                  description: "No templates, no databases to configure. Just start dumping and we'll organize it.",
                },
                {
                  title: "Low-friction capture",
                  description: "Chat-style interface means no decision paralysis. Type, speak, or upload—we handle the rest.",
                },
                {
                  title: "Rejection workflow",
                  description: "Nope bin lets you quickly reject without guilt. No second-guessing or "maybe later" piles.",
                },
                {
                  title: "Visual clustering",
                  description: "MindStorm shows your brain patterns in color. See connections without reading everything.",
                },
                {
                  title: "Local-first privacy",
                  description: "Your notes are encrypted and private by default. We never see your plaintext content.",
                },
                {
                  title: "ND-friendly microcopy",
                  description: "Every word is chosen to reduce cognitive load. Supportive, not judgmental. Clear, not clever.",
                },
              ].map((item, index) => (
                <AnimatedItem key={index}>
                  <Card className="h-full border-[var(--klutr-outline)]/20">
                    <CardHeader>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                        {item.description}
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
              <h2 className="text-4xl md:text-6xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] leading-tight">
                Ready to try something different?
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
                  Try Klutr Free
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

