import { getPageMetadata } from "@/lib/queries/metadata";
import type { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";
import { UseCaseCard } from "@/components/marketing/UseCaseCard";
import { DecorativeBackground } from "@/components/marketing/DecorativeBackground";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lightbulb, Users, Rocket } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMetadata("pricing");

  const title = meta?.seoTitle ?? "Pricing — Klutr";
  const description =
    meta?.metaDescription ??
    "Free during Beta! Join early users and help shape the future of note-taking. No credit card required.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://klutr.app/pricing",
      siteName: "Klutr",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Klutr Pricing",
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
      canonical: "https://klutr.app/pricing",
    },
  };
}

export const revalidate = 60;

const faqItems = [
  {
    question: "What makes Klutr different from Notion or Apple Notes?",
    answer:
      "Klutr organizes your notes automatically using AI—no folders, no manual sorting. Just dump everything in, and we handle the organization. Plus, our Stream-first approach means you never lose an idea.",
  },
  {
    question: "How does AI clustering work?",
    answer:
      "Klutr uses embeddings to understand the meaning of your content, then groups similar ideas together automatically. You can always reorganize manually if needed, but most users find the automatic clustering saves hours of work.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. Klutr uses end-to-end encryption for Vault notes and Supabase Row-Level Security (RLS) to keep your data safe and private. We never see your plaintext vault contents.",
  },
  {
    question: "Can I import notes from other apps?",
    answer:
      "Yes! You can drop PDFs, screenshots, text files, and even voice recordings directly into your Stream. We'll automatically process and organize them.",
  },
  {
    question: "What happens after the beta?",
    answer:
      "Free Beta users will continue to have access to all beta features. Pro and Team tiers will launch with additional features like advanced insights and collaboration tools.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. Your data remains accessible, and you can export everything before canceling.",
  },
];

const useCases = [
  {
    title: "For Individuals",
    description:
      "Capture everything—notes, voice, images. AI organizes automatically. Perfect for knowledge workers, researchers, and creators who need to dump ideas without the organizational overhead.",
    features: [
      "Low-friction capture for chaotic brains",
      "Automatic sorting (executive-function support)",
      "No 'perfect system' pressure",
      "Gentle resurfacing (memory-friendly)",
    ],
    icon: <Lightbulb className="w-7 h-7 text-white" />,
  },
  {
    title: "For Power Users",
    description:
      "Advanced insights and unlimited storage for users who want to go deeper. Get priority processing, extended retention, and advanced clustering to discover patterns in your thinking.",
    features: [
      "Advanced AI insights and pattern recognition",
      "Priority processing for faster organization",
      "Unlimited storage for all your captures",
      "Extended retention to never lose an idea",
    ],
    icon: <Rocket className="w-7 h-7 text-white" />,
  },
  {
    title: "For Teams",
    description:
      "Collaborate on boards, share insights, manage team knowledge. Perfect for teams that need to organize collective chaos while maintaining individual workflows.",
    features: [
      "Shared boards for team collaboration",
      "Role-based permissions for security",
      "Team insights and analytics",
      "Admin dashboard for management",
    ],
    icon: <Users className="w-7 h-7 text-white" />,
  },
];

export default async function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <main className="relative">
        <DecorativeBackground />

        {/* Hero Section */}
        <section className="relative container mx-auto px-6 max-w-[1440px] py-24">
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-[72px] font-bold leading-[88px] text-black">
              Unbeatable prices, simple.
            </h1>
            <p className="text-[32px] font-normal leading-[40px] text-black">
              Start for free, or as low as $8 a month.
            </p>
          </div>

          <PricingSection />
        </section>

        {/* Use Cases Section */}
        <section className="relative container mx-auto px-6 max-w-[1440px] py-24">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {useCases.map((useCase, index) => (
              <UseCaseCard key={index} {...useCase} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative container mx-auto px-6 max-w-[1440px] py-24">
          <div className="text-center mb-16">
            <h2 className="text-[56px] font-bold leading-[69px] text-black mb-4">
              Frequently asked questions
            </h2>
          </div>
          <FAQAccordion items={faqItems} />
          <div className="text-center mt-12">
            <p className="text-xl font-normal leading-[26px] text-black mb-6">
              Still have questions?
            </p>
            <Button
              className="bg-[#975BEC] border-[3px] border-[#7345B3] rounded-[52px] px-8 py-4 text-white font-bold text-lg shadow-[4px_4px_0px_#7345B3] hover:shadow-[6px_6px_0px_#7345B3] transition-all"
              asChild
            >
              <Link href="/help">Contact Support</Link>
            </Button>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="relative bg-[#FCFCE8] py-24">
          <div className="container mx-auto px-6 max-w-[1440px] text-center space-y-8">
            <h2 className="text-[56px] font-bold leading-[69px] text-black">
              Get more productive with Klutr
            </h2>
            <Button
              className="bg-[#975BEC] border-[4px] border-[#7345B3] rounded-[52px] px-8 py-4 text-white font-bold text-lg shadow-[7px_7px_0px_#7345B3] hover:shadow-[9px_9px_0px_#7345B3] transition-all"
              asChild
            >
              <Link href="/signup">Start Now - Free</Link>
            </Button>
            <div className="flex justify-center gap-8 text-lg font-normal text-black">
              <span>Try FREE for 14 days</span>
              <span>•</span>
              <span>No card required</span>
              <span>•</span>
              <span>No switching banks</span>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
