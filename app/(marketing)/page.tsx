import { getHomePage, getFeatures } from "@/lib/queries";
import { getPageMetadata } from "@/lib/queries/metadata";
import { getHomeContent } from "@/lib/basehub/queries/pages";
import type { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import Hero from "@/components/marketing/Hero";
import UIPreviewStrip from "@/components/marketing/UIPreviewStrip";
import FeatureGridWithMockups from "@/components/marketing/FeatureGridWithMockups";
import ColorBlockSection from "@/components/marketing/ColorBlockSection";
import BetaCTABlock from "@/components/marketing/BetaCTABlock";
import PersonaGrid from "@/components/marketing/PersonaGrid";
import PricingCard from "@/components/marketing/PricingCard";
import FinalCTAStrip from "@/components/marketing/FinalCTAStrip";
import {
  AnimatedSection,
  AnimatedItem,
} from "@/components/marketing/AnimatedSection";
import {
  Zap,
  Layers,
  Brain,
  Search,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMetadata("home");

  const title =
    meta?.seoTitle ?? "Klutr – Organize Your Chaos. Keep the Spark.";
  const description =
    meta?.metaDescription ??
    "Capture anything, let AI organize everything. Klutr turns scattered ideas into clear insights with effortless sorting and visual clusters.";

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
  };
}

export const revalidate = 60;

export default async function MarketingHomePage() {
  // Fetch BaseHub content
  const homeContent = await getHomeContent();
  const home = await getHomePage();

  // Use BaseHub heroBlock if available, otherwise fallback
  const heroData = homeContent.heroBlock || {
    title: home?.heroHeadline || "Organize your chaos. Keep the spark.",
    subtitle:
      home?.heroSubtext ||
      "Capture text, screenshots, ideas, or voice notes—Klutr sorts everything automatically so you stay clear-headed and creative.",
    ctaText: home?.primaryCTA || "Join the Beta Free",
    ctaLink: "/login",
    image: null,
  };

  // Fallback data if BaseHub is unavailable
  const homeData = {
    heroHeadline: heroData.title,
    heroSubtext: heroData.subtitle,
    primaryCTA: heroData.ctaText,
    secondaryCTA: "See How It Works",
  };

  // Updated personas matching wireframe spec
  const personas = [
    {
      title: "The Fast Thinker",
      description: "Constant idea generation, needs quick capture.",
      iconName: "Zap",
    },
    {
      title: "The Overloaded Multi-Tasker",
      description: "Drowning in tabs, apps, and notes.",
      iconName: "Layers",
    },
    {
      title: "The Creative Brain",
      description: "Nonlinear thinker needing clusters and patterns.",
      iconName: "Brain",
    },
    {
      title: "The Organizer-at-Heart",
      description: "Wants everything tidy and searchable.",
      iconName: "Search",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      {/* 1. HEADER */}
      <MarketingHeader />

      <main>
        {/* 2. HERO SECTION */}
        <Hero
          heroHeadline={homeData.heroHeadline}
          heroSubtext={homeData.heroSubtext}
          primaryCTA={homeData.primaryCTA}
          secondaryCTA={homeData.secondaryCTA}
        />

        {/* 3. INTEGRATED UI PREVIEW STRIP */}
        <UIPreviewStrip />

        {/* 4. FEATURE GRID (3 tiles) */}
        <FeatureGridWithMockups
          headline="Both familiar and new."
          features={[
            {
              title: "Stream everything instantly",
              description: "Your always-on inbox. One place for every idea your brain throws at you—text, voice, images, or screenshots.",
              imageSrc: "/illustrations/barcelona/Welcome-1--Streamline-Barcelona.svg",
              imageAlt: "Stream interface showing chat-style capture",
              gradientColor: "coral",
            },
            {
              title: "MindStorm to find patterns",
              description: "See how your ideas connect. Visual clusters reveal patterns and relationships instantly, turning scattered notes into coherent thinking.",
              imageSrc: "/illustrations/brooklyn/Success-3--Streamline-Brooklyn.svg",
              imageAlt: "MindStorm clustering visualization",
              gradientColor: "mint",
            },
            {
              title: "Insights that reveal meaning",
              description: "Your brain, summarized. Weekly highlights show trends and forgotten gems that help you see patterns in your thinking.",
              imageSrc: "/illustrations/barcelona/Finding-1--Streamline-Barcelona.svg",
              imageAlt: "Insights dashboard showing weekly summaries",
              gradientColor: "purple",
            },
          ]}
        />

        {/* 5. COLOR-BLOCK SECTIONS */}
        {/* Coral section: Dump your thoughts instantly */}
        <ColorBlockSection
          backgroundColor="coral"
          title="Dump your thoughts instantly"
          description="No friction, no structure required. Just capture everything that crosses your mind—text, voice, images, screenshots. Klutr handles the rest."
          bullets={[
            "Capture in seconds, not minutes",
            "Multi-format support (text, voice, images)",
            "Always-on inbox for your ideas",
          ]}
          imageSrc="/illustrations/barcelona/Welcome-1--Streamline-Barcelona.svg"
          imageAlt="Stream interface for instant capture"
          ctaText="Try Stream Free"
          ctaLink="/login"
          reversed={false}
        />

        {/* Teal section: Turn your chaos into clusters */}
        <ColorBlockSection
          backgroundColor="teal"
          title="Turn your chaos into clusters"
          description="MindStorm automatically groups related ideas, revealing patterns and connections you didn't know existed. Watch your thoughts organize themselves."
          bullets={[
            "Automatic clustering of related ideas",
            "Visual patterns reveal connections",
            "No manual tagging required",
          ]}
          imageSrc="/illustrations/brooklyn/Success-3--Streamline-Brooklyn.svg"
          imageAlt="MindStorm clustering visualization"
          ctaText="Explore MindStorm"
          ctaLink="/login"
          reversed={true}
        />

        {/* Soft Neutral section: Search your brain's memory */}
        <ColorBlockSection
          backgroundColor="softNeutral"
          title="Search your brain's memory"
          description="Find anything you've captured, instantly. Memory Lane gives you a complete timeline of your thoughts, searchable and organized."
          bullets={[
            "Full timeline of all your captures",
            "Powerful search across everything",
            "Rediscover forgotten ideas",
          ]}
          imageSrc="/illustrations/barcelona/Finding-1--Streamline-Barcelona.svg"
          imageAlt="Memory search interface"
          ctaText="Try Memory Search"
          ctaLink="/login"
          reversed={false}
        />

        {/* Purple section: Stay organized without trying */}
        <ColorBlockSection
          backgroundColor="purple"
          title="Stay organized without trying"
          description="Klutr works in the background, automatically sorting and organizing your ideas. No templates, no setup, no maintenance—just clarity."
          bullets={[
            "Zero-configuration organization",
            "Automatic sorting and tagging",
            "Works while you sleep",
          ]}
          imageSrc="/illustrations/brooklyn/Interface-Testing-2--Streamline-Brooklyn.svg"
          imageAlt="Automatic organization interface"
          ctaText="See How It Works"
          ctaLink="/login"
          reversed={true}
        />

        {/* 6. MAJOR BETA CTA BLOCK */}
        <BetaCTABlock />

        {/* 7. PERSONA GRID */}
        <section className="container mx-auto px-6 py-20">
          <AnimatedSection className="space-y-12">
            <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Who Klutr is for
              </h2>
            </AnimatedItem>
            <PersonaGrid personas={personas} columns={2} />
          </AnimatedSection>
        </section>

        {/* 8. PRICING SECTION */}
        <section className="container mx-auto px-6 py-20">
          <AnimatedSection className="space-y-12">
            <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Simple, transparent pricing
              </h2>
              <p className="text-xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                Start free. Upgrade when you're ready.
              </p>
            </AnimatedItem>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <PricingCard
                tier="Free (Beta)"
                price="Free"
                features={[
                  "Capture, Stream, tagging",
                  "Basic organization",
                  "Gentle resurfacing",
                  "Up to 100 notes",
                  "Community support",
                ]}
                cta="Join Beta Free"
                ctaLink="/login"
                isBeta={true}
                betaBadgeText="Join now. Save forever."
                lifetimeDiscountNote="All beta users receive a guaranteed lifetime discount at launch."
              />
              <PricingCard
                tier="Pro"
                price="$12"
                period="month"
                features={[
                  "Everything in Free",
                  "MindStorm clustering",
                  "Weekly Insights",
                  "Unlimited notes",
                  "Priority support",
                ]}
                cta="Start Pro Trial"
                ctaLink="/login"
                highlighted={true}
              />
              <PricingCard
                tier="Team"
                price="$24"
                period="month"
                features={[
                  "Everything in Pro",
                  "Team collaboration",
                  "Shared workspaces",
                  "Admin controls",
                  "Advanced analytics",
                  "Dedicated support",
                ]}
                cta="Contact Sales"
                ctaLink="/login"
              />
            </div>
          </AnimatedSection>
        </section>

        {/* 9. FINAL CTA STRIP */}
        <FinalCTAStrip />
      </main>

      {/* 10. FOOTER */}
      <MarketingFooter />
    </div>
  );
}
