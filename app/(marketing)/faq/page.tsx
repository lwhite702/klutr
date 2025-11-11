import { getPageMetadata } from "@/lib/queries/metadata";
import {
  getLatestChangelogEntries,
  getUpcomingRoadmapItems,
} from "@/lib/queries";
import { getFaqContent } from "@/lib/basehub/queries/pages";
import type { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import {
  AnimatedSection,
  AnimatedFadeIn,
} from "@/components/marketing/AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sparkles } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMetadata("faq");

  return {
    title: meta?.seoTitle ?? "FAQ — Klutr",
    description:
      meta?.metaDescription ??
      "Frequently asked questions about Klutr. Learn about features, pricing, and how to get started.",
    openGraph: {
      title: meta?.seoTitle ?? "FAQ — Klutr",
      description:
        meta?.metaDescription ??
        "Frequently asked questions about Klutr. Learn about features, pricing, and how to get started.",
      url: "https://klutr.app/faq",
      siteName: "Klutr",
    },
  };
}

export const revalidate = 60;

export default async function FAQPage() {
  const faqContent = await getFaqContent();
  const [latestReleases, upcomingItems] = await Promise.all([
    getLatestChangelogEntries(),
    getUpcomingRoadmapItems(),
  ]);

  // Fallback FAQ data if BaseHub is unavailable
  const faqData = faqContent.faqBlock || {
    questions: [
      {
        question: "What is Klutr?",
        answer: "Klutr is a conversational workspace where all your input—text, voice, images, files—flows naturally through a Stream interface and gets automatically organized on the backend.",
      },
      {
        question: "Is Klutr free?",
        answer: "Yes! Klutr is currently in beta and completely free. No credit card required.",
      },
      {
        question: "How does AI organization work?",
        answer: "Klutr uses AI to automatically tag your notes and group them into Boards based on content similarity. You can also manually organize if you prefer.",
      },
    ],
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
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-xl font-body text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
              Everything you need to know about Klutr
            </p>
          </AnimatedFadeIn>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqData.questions.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-[var(--klutr-outline)]/20 rounded-2xl px-6 py-4 shadow-sm"
                >
                  <AccordionTrigger className="text-left font-display font-semibold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[var(--klutr-text-primary-light)]/80 dark:text-[var(--klutr-text-primary-dark)]/80 font-body leading-relaxed pt-2">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </AnimatedSection>
      </main>

      <MarketingFooter
        latestReleases={latestReleases}
        upcomingItems={upcomingItems}
      />
    </div>
  );
}

