import { getPageMetadata } from "@/lib/queries/metadata";
import {
  getLatestChangelogEntries,
  getUpcomingRoadmapItems,
} from "@/lib/queries";
import { getPricingContent } from "@/lib/basehub/queries/pages";
import type { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import {
  AnimatedSection,
  AnimatedFadeIn,
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
import { Check, Sparkles } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMetadata("pricing");

  return {
    title: meta?.seoTitle ?? "Pricing — Klutr",
    description:
      meta?.metaDescription ??
      "Free during Beta! Join early users and help shape the future of note-taking. No credit card required.",
    openGraph: {
      title: meta?.seoTitle ?? "Pricing — Klutr",
      description:
        meta?.metaDescription ??
        "Free during Beta! Join early users and help shape the future of note-taking. No credit card required.",
      url: "https://klutr.app/pricing",
      siteName: "Klutr",
    },
  };
}

export const revalidate = 60;

export default async function PricingPage() {
  const pricingContent = await getPricingContent();
  const [latestReleases, upcomingItems] = await Promise.all([
    getLatestChangelogEntries(),
    getUpcomingRoadmapItems(),
  ]);

  // Use BaseHub pricingBlock if available, otherwise use fallback
  const pricingData = pricingContent.pricingBlock || {
    tierName: "Beta Access",
    price: "Free",
    features: [
      "Unlimited notes and captures",
      "AI-powered organization",
      "Smart tagging and clustering",
      "Secure vault for sensitive notes",
      "Weekly insights and summaries",
      "All features included",
      "Early access to new features",
      "Direct feedback channel",
    ],
    ctaLink: "/login",
  };

  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      <MarketingHeader />

      <main>
        <AnimatedSection className="container mx-auto px-6 py-24">
          <AnimatedFadeIn className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-[var(--klutr-coral)]" />
              <h1 className="text-4xl md:text-5xl font-display font-bold">
                Pricing
              </h1>
            </div>
            <p className="text-xl font-body text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
              Free during Beta!
            </p>
          </AnimatedFadeIn>

          <div className="max-w-4xl mx-auto">
            <Card className="border-[var(--klutr-outline)]/20 rounded-2xl shadow-2xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl md:text-4xl font-display mb-4">
                  {pricingData.tierName}
                </CardTitle>
                <div className="mt-8">
                  <div className="text-5xl font-display font-bold text-[var(--klutr-coral)] mb-2">
                    {pricingData.price}
                  </div>
                  <p className="text-sm text-muted-foreground font-body">
                    No credit card required
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {pricingData.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[var(--klutr-mint)] flex-shrink-0 mt-0.5" />
                      <span className="font-body">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-6">
                  <Button
                    size="lg"
                    className="w-full bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white text-lg px-8 py-6 rounded-2xl shadow-xl"
                    asChild
                  >
                    <Link href={pricingData.ctaLink || "/login"} aria-label="Get started with free beta">
                      Get Started Free
                    </Link>
                  </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground font-body">
                  Beta access is limited. Join now to secure your spot.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Use BaseHub ctaBlock if available, otherwise use fallback */}
          {pricingContent.ctaBlock ? (
            <AnimatedFadeIn className="mt-16 text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-bold">
                {pricingContent.ctaBlock.headline || "Questions about pricing?"}
              </h2>
              {pricingContent.ctaBlock.ctaText && (
                <Button variant="outline" className="mt-4 rounded-2xl" asChild>
                  <Link href={pricingContent.ctaBlock.ctaLink || "/help"}>
                    {pricingContent.ctaBlock.ctaText}
                  </Link>
                </Button>
              )}
            </AnimatedFadeIn>
          ) : (
            <AnimatedFadeIn className="mt-16 text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-bold">
                Questions about pricing?
              </h2>
              <p className="text-lg font-body text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                We're in beta and everything is free. No hidden fees, no credit
                card required. Just drop your thoughts and start organizing your
                chaos.
              </p>
              <Button variant="outline" className="mt-4 rounded-2xl" asChild>
                <Link href="/help">Visit Help Center</Link>
              </Button>
            </AnimatedFadeIn>
          )}
        </AnimatedSection>
      </main>

      <MarketingFooter
        latestReleases={latestReleases}
        upcomingItems={upcomingItems}
      />
    </div>
  );
}
