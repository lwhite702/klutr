import { getFeatures } from "@/lib/queries/features";
import { getFeaturesContent } from "@/lib/basehub/queries/pages";
import { getPageMetadata } from "@/lib/queries/metadata";
import type { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import FeatureModule from "@/components/marketing/FeatureModule";
import SpotlightSection from "@/components/marketing/SpotlightSection";
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
      "Discover the core features that make Klutr the best AI-powered note-taking app. Stream-first capture, automatic organization, and a rediscovery-friendly timeline.",
    openGraph: {
      title: meta?.seoTitle ?? "Features — Klutr",
      description:
        meta?.metaDescription ??
        "Discover the core features that make Klutr the best AI-powered note-taking app. Stream-first capture, automatic organization, and a rediscovery-friendly timeline.",
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
  const features = (await getFeatures()).filter(
    (feature) => !["Vault", "Stacks", "Smart Stacks"].includes(feature.name)
  );

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
              and gets automatically organized on the backend. We’re shipping
              the reliable, everyday tools first while Vault and Stacks stay
              paused during beta.
            </p>
          </AnimatedFadeIn>

          {/* Feature Spotlights */}
          <SpotlightSection
            features={[
              {
                id: "stream-spotlight",
                preheader: "Capture",
                title: (
                  <>
                    Your always-on <span className="text-[#FF6B6B]">Stream</span>
                  </>
                ),
                description:
                  "One place for every idea your brain throws at you—text, voice, images, or screenshots. No formatting needed. Just dump everything in and let Klutr handle the rest.",
                imageSrc: "/illustrations/barcelona/Welcome-1--Streamline-Barcelona.svg",
                imageAlt: "Stream capture interface",
                ctaText: "Try Stream",
                ctaLink: "/login",
              },
              {
                id: "mindstorm-spotlight",
                preheader: "Organize",
                title: (
                  <>
                    See connections with <span className="text-[#00C896]">MindStorm</span>
                  </>
                ),
                description:
                  "Visual clusters reveal patterns and relationships instantly. Watch your scattered notes transform into coherent thinking as AI discovers connections you never noticed.",
                imageSrc: "/illustrations/brooklyn/Success-3--Streamline-Brooklyn.svg",
                imageAlt: "MindStorm clustering visualization",
                ctaText: "Explore MindStorm",
                ctaLink: "/login",
              },
              {
                id: "ownership-spotlight",
                preheader: "Trust",
                title: (
                  <>
                    Data ownership &amp; clarity
                  </>
                ),
                description:
                  "You control what you capture and how it’s used. During beta we’re focused on secure defaults, transparent storage, and exportability instead of unfinished encryption claims.",
                imageSrc: "/illustrations/brooklyn/Success-3--Streamline-Brooklyn.svg",
                imageAlt: "Data ownership and clarity",                
                ctaText: "See how we handle data",
                ctaLink: "/pricing#security",
              },
            ]}
            accentColor="coral"
          />

          {/* Two-column feature modules */}
          <div className="space-y-0">
            <FeatureModule
              title="Stream"
              description="One box for everything your brain throws at you."
              reverse={false}
            />
            <FeatureModule
              title="Multi-modal capture"
              description="Brains don't format ideas. Neither do we."
              reverse={true}
            />
            <FeatureModule
              title="Automatic sorting"
              description="Organization without organizational energy."
              reverse={false}
            />
            <FeatureModule
              title="MindStorm"
              description="See your brain patterns in color."
              reverse={true}
            />
            <FeatureModule
              title="Insights"
              description="Your ideas, rediscovered."
              reverse={false}
            />
            <FeatureModule
              title="Memory Lane"
              description="Because your brain doesn't run on folders."
              reverse={true}
            />
            <FeatureModule
              title="Nope Bin"
              description="Quick rejection without guilt."
              reverse={false}
            />
            <FeatureModule
              title="Data ownership"
              description="Clear exports, transparent storage, and user control while Vault is paused."
              reverse={true}
            />
          </div>
        </AnimatedSection>
      </main>

      <MarketingFooter />
    </div>
  );
}
