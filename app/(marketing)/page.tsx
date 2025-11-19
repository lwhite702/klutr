import { getHomePage, getFeatures } from "@/lib/queries";
import { getPageMetadata } from "@/lib/queries/metadata";
import { getHomeContent } from "@/lib/basehub/queries/pages";
import type { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import Hero from "@/components/marketing/Hero";
import ProblemStatement from "@/components/marketing/ProblemStatement";
import ValueGrid from "@/components/marketing/ValueGrid";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import FeatureGridWithMockups from "@/components/marketing/FeatureGridWithMockups";
import TrustSection from "@/components/marketing/TrustSection";
import KlutrFeaturesSection from "@/components/marketing/KlutrFeaturesSection";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";
import PersonaGrid from "@/components/marketing/PersonaGrid";
import PricingCard from "@/components/marketing/PricingCard";
import {
  AnimatedSection,
  AnimatedItem,
  AnimatedFadeIn,
} from "@/components/marketing/AnimatedSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Layers,
  Brain,
  RotateCcw,
  Eye,
  Clock,
  XCircle,
  Lock,
  Palette,
  Users,
  BookOpen,
  Lightbulb,
  Briefcase,
  PenTool,
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
    ctaText: home?.primaryCTA || "Start Dumping",
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

  // Core values for value grid
  const coreValues = [
    {
      title: "Capture anything",
      description: "Text, snaps, voice notes, random thoughts—it all goes in.",
      iconName: "MessageSquare",
      color: "coral" as const,
    },
    {
      title: "Automatic sorting",
      description: "No setup. No templates. Klutr organizes in real time.",
      iconName: "Layers",
      color: "mint" as const,
    },
    {
      title: "Visual MindStorm",
      description: "Clusters reveal patterns and connections instantly.",
      iconName: "Brain",
      color: "coral" as const,
    },
    {
      title: "Gentle resurfacing",
      description:
        "Daily reminders bring back your best ideas at the right moment.",
      iconName: "RotateCcw",
      color: "mint" as const,
    },
  ];

  // Personas for persona grid
  const personas = [
    {
      title: "Creators",
      description: "Turn chaotic ideas into content pillars.",
      iconName: "Palette",
    },
    {
      title: "Founders & Builders",
      description: "Connect product riffs, investor notes, and brainstorms.",
      iconName: "Briefcase",
    },
    {
      title: "Students & Researchers",
      description: "Organize lecture notes and sources automatically.",
      iconName: "BookOpen",
    },
    {
      title: "Neurodivergent Minds",
      description: "Low-friction capture + zero pressure to build a system.",
      iconName: "Lightbulb",
    },
    {
      title: "Writers",
      description:
        "Watch characters, threads, and scenes take shape naturally.",
      iconName: "PenTool",
    },
    {
      title: "Busy Multitaskers",
      description: "Capture fast. Let Klutr handle the structure.",
      iconName: "Users",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      <MarketingHeader />

      <main>
        {/* 1. HERO */}
        <Hero
          heroHeadline={homeData.heroHeadline}
          heroSubtext={homeData.heroSubtext}
          primaryCTA={homeData.primaryCTA}
          secondaryCTA={homeData.secondaryCTA}
        />

        {/* 2. PROBLEM STATEMENT */}
        <ProblemStatement>
          Everyone has the same problem: ideas scattered across screenshots,
          half-written notes, camera rolls, and forgotten voice memos. Klutr
          turns that mess into something useful—without forcing you into another
          complicated system.
        </ProblemStatement>

        {/* 3. CORE VALUE GRID */}
        <section className="container mx-auto px-6 py-20">
          <AnimatedSection className="space-y-12">
            <AnimatedItem className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Why Klutr Works
              </h2>
            </AnimatedItem>
            <ValueGrid values={coreValues} columns={4} />
          </AnimatedSection>
        </section>

        {/* 3.5. FEATURE GRID WITH MOCKUPS (Three-column grid with device frames) */}
        <FeatureGridWithMockups
          headline="The features Both familiar and new."
          features={[
            {
              title: "Stream",
              description: "Your always-on inbox. One place for every idea your brain throws at you—text, voice, images, or screenshots.",
              imageSrc: "/illustrations/barcelona/Welcome-1--Streamline-Barcelona.svg",
              imageAlt: "Stream interface showing chat-style capture",
              gradientColor: "yellow",
            },
            {
              title: "MindStorm",
              description: "See how your ideas connect. Visual clusters reveal patterns and relationships instantly, turning scattered notes into coherent thinking.",
              imageSrc: "/illustrations/brooklyn/Success-3--Streamline-Brooklyn.svg",
              imageAlt: "MindStorm clustering visualization",
              gradientColor: "purple",
            },
            {
              title: "Insights",
              description: "Your brain, summarized. Weekly highlights show trends and forgotten gems that help you see patterns in your thinking.",
              imageSrc: "/illustrations/barcelona/Finding-1--Streamline-Barcelona.svg",
              imageAlt: "Insights dashboard showing weekly summaries",
              gradientColor: "blue",
            },
          ]}
        />

        {/* 3.6. TRUST SECTION (Centered CTA) */}
        <TrustSection
          preheader="Advantages"
          headline="A note-taking system you can trust for your ideas"
          description="Capture anything, organize automatically, and rediscover insights without overthinking your system."
          ctaText="Get Started"
          ctaLink="/login"
          preheaderColor="purple"
        />

        {/* 4. FEATURE SPOTLIGHTS (Alternating layout) */}
        <KlutrFeaturesSection
          headline="Everything you need to succeed"
          subheadline="Powerful features designed to help you capture, organize, and rediscover your ideas."
          badgeLabel="Features"
          features={[
            {
              id: 1,
              title: "Stream",
              description: "Your always-on inbox. One place for every idea your brain throws at you—text, voice, images, or screenshots.",
              iconName: "MessageSquare",
              screenshot: "/illustrations/notes-tasks/note-01.svg",
              screenshotAlt: "Stream interface showing chat-style capture",
              color: "coral",
              badges: ["Fast Capture", "Multi-format", "Always On"],
            },
            {
              id: 2,
              title: "MindStorm",
              description: "See how your ideas connect. Visual clusters reveal patterns and relationships instantly, turning scattered notes into coherent thinking.",
              iconName: "Brain",
              screenshot: "/illustrations/notes-tasks/sticky-note-02.svg",
              screenshotAlt: "MindStorm clustering visualization",
              color: "mint",
              badges: ["Visual Clusters", "Auto-Organize", "Pattern Discovery"],
            },
            {
              id: 3,
              title: "Insights",
              description: "Your brain, summarized. Weekly highlights show trends and forgotten gems.",
              iconName: "Eye",
              screenshot: "/illustrations/notes-tasks/notebook.svg",
              screenshotAlt: "Insights dashboard showing weekly summaries",
              color: "coral",
              badges: ["Weekly Summaries", "Trend Analysis", "Smart Resurfacing"],
            },
            {
              id: 4,
              title: "Memory Lane",
              description: "Rediscover anything. A clean timeline of everything you've captured.",
              iconName: "Clock",
              screenshot: "/illustrations/notes-tasks/note-done.svg",
              screenshotAlt: "Memory timeline view",
              color: "mint",
              badges: ["Timeline View", "Easy Search", "Full History"],
            },
            {
              id: 5,
              title: "Nope",
              description: "Clear noise without guilt. Not every idea sticks.",
              iconName: "XCircle",
              screenshot: "/illustrations/notes-tasks/note-02.svg",
              screenshotAlt: "Nope bin for rejected ideas",
              color: "coral",
              badges: ["Quick Rejection", "No Guilt", "Clean Workspace"],
            },
            {
              id: 6,
              title: "Vault",
              description: "Sensitive notes stay encrypted. On-device processing + encryption keep thoughts private.",
              iconName: "Lock",
              screenshot: "/illustrations/security/padlock-01.svg",
              screenshotAlt: "Encrypted vault for sensitive notes",
              color: "mint",
              badges: ["End-to-End Encryption", "Private", "Secure"],
            },
          ]}
        />

        {/* 5. HOW IT WORKS */}
        <HowItWorksSection />

        {/* 6. PERSONA GRID */}
        <section className="container mx-auto px-6 py-20">
          <AnimatedSection className="space-y-12">
            <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Built for how you think
              </h2>
              <p className="text-xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                Klutr adapts to your workflow, not the other way around
              </p>
            </AnimatedItem>
            <PersonaGrid personas={personas} columns={3} />
          </AnimatedSection>
        </section>

        {/* 7. LIGHT ND CALLOUT */}
        <section className="bg-gradient-to-br from-[var(--klutr-coral)]/10 to-[var(--klutr-mint)]/10 py-20">
          <div className="container mx-auto px-6">
            <AnimatedFadeIn className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Designed for fast, nonlinear thinkers
              </h2>
              <p className="text-xl md:text-2xl text-[var(--klutr-text-primary-light)]/80 dark:text-[var(--klutr-text-primary-dark)]/80 leading-relaxed">
                Klutr's frictionless capture, auto-sorting, and visual clusters
                fit the way many creative and neurodivergent minds think—without
                making it the entire pitch.
              </p>
              <Button
                size="lg"
                className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
                asChild
              >
                <Link href="/neurodivergent">Learn More About ND Support</Link>
              </Button>
            </AnimatedFadeIn>
          </div>
        </section>

        {/* 8. PRICING */}
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
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <PricingCard
                tier="Free"
                price="Free"
                features={[
                  "Capture, Stream, tagging",
                  "Basic organization",
                  "Gentle resurfacing",
                  "Up to 100 notes",
                  "Community support",
                ]}
                cta="Start Free"
                ctaLink="/login"
              />
              <PricingCard
                tier="Pro"
                price="$12"
                period="month"
                features={[
                  "Everything in Free",
                  "MindStorm clustering",
                  "Weekly Insights",
                  "Encrypted Vault",
                  "Unlimited notes",
                  "Priority support",
                ]}
                cta="Start Pro Trial"
                ctaLink="/login"
                highlighted={true}
              />
            </div>
          </AnimatedSection>
        </section>

        {/* 9. FINAL CTA */}
        <section className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] py-28">
          <div className="container mx-auto px-6">
            <AnimatedFadeIn className="max-w-3xl mx-auto text-center space-y-10">
              <h2 className="text-4xl md:text-6xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] leading-tight">
                Ready to clear the clutr?
              </h2>
              <p className="text-xl md:text-2xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 max-w-2xl mx-auto leading-relaxed">
                The fastest way to capture ideas—and the easiest way to organize
                them.
              </p>
              <Button
                size="lg"
                className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white text-lg px-8 py-6 rounded-full"
                asChild
              >
                <Link href="/login" aria-label="Start Dumping">
                  Start Dumping
                </Link>
              </Button>
            </AnimatedFadeIn>
          </div>
        </section>
      </main>

      {/* 10. FOOTER */}
      <MarketingFooter />
    </div>
  );
}
