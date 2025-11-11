import { getFeatures } from "@/lib/queries/features";
import { getFeaturesContent } from "@/lib/basehub/queries/pages";
import { getPageMetadata } from "@/lib/queries/metadata";
import {
  getLatestChangelogEntries,
  getUpcomingRoadmapItems,
} from "@/lib/queries";
import type { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import {
  AnimatedSection,
  AnimatedFadeIn,
} from "@/components/marketing/AnimatedSection";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMetadata("features");

  return {
    title: meta?.seoTitle ?? "Features — Klutr",
    description:
      meta?.metaDescription ??
      "Discover all the features that make Klutr the best AI-powered note-taking app. Stream, Boards, Muse, Vault, and more.",
    openGraph: {
      title: meta?.seoTitle ?? "Features — Klutr",
      description:
        meta?.metaDescription ??
        "Discover all the features that make Klutr the best AI-powered note-taking app. Stream, Boards, Muse, Vault, and more.",
      url: "https://klutr.app/features",
      siteName: "Klutr",
    },
  };
}

/**
 * Features index page
 * Lists all features from BaseHub
 * Revalidates every 60 seconds
 */
export const revalidate = 60;

export default async function FeaturesPage() {
  const featuresContent = await getFeaturesContent();
  const [features, latestReleases, upcomingItems] = await Promise.all([
    getFeatures(),
    getLatestChangelogEntries(),
    getUpcomingRoadmapItems(),
  ]);

  // Use BaseHub featureGridBlock heading if available
  const heading = featuresContent.featureGridBlock?.heading || "Everything you need to organize your chaos";

  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      <MarketingHeader />

      <main>
        <AnimatedSection className="container mx-auto px-6 py-24">
          <AnimatedFadeIn className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
              {heading}
            </h1>
            <p className="text-xl font-body text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
              Klutr is a conversational workspace where all your input—text,
              voice, images, files—flows naturally through a Stream interface
              and gets automatically organized on the backend.
            </p>
          </AnimatedFadeIn>

          {/* Use BaseHub featureGridBlock if available, otherwise fallback to existing getFeatures() */}
          {featuresContent.featureGridBlock && featuresContent.featureGridBlock.features.length > 0 ? (
            <FeatureGrid features={featuresContent.featureGridBlock.features.map(f => ({
              title: f.title || "",
              description: f.description || "",
              icon: f.icon?.url || "",
            }))} />
          ) : (
            <FeatureGrid features={features} />
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
