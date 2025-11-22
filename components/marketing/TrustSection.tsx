"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TrustSectionProps {
  preheader?: string;
  headline: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  preheaderColor?: "purple" | "coral" | "mint";
}

export default function TrustSection({
  preheader = "Advantages",
  headline = "A task manager you can trust to clear your chaos",
  description = "Plan projects, stay on track, and deliver on time without juggling extra admin layers.",
  ctaText = "Get Started",
  ctaLink = "/login",
  preheaderColor = "purple",
}: TrustSectionProps) {
  const getPreheaderColor = () => {
    switch (preheaderColor) {
      case "purple":
        return "text-purple-600 dark:text-purple-400";
      case "coral":
        return "text-[var(--klutr-coral)]";
      case "mint":
        return "text-[var(--klutr-mint)]";
      default:
        return "text-purple-600 dark:text-purple-400";
    }
  };

  const getCtaColor = () => {
    // Use Klutr brand colors for CTA
    return "bg-gradient-to-r from-[var(--klutr-coral)] to-[var(--klutr-coral)]/90 hover:from-[var(--klutr-coral)]/90 hover:to-[var(--klutr-coral)] text-white";
  };

  return (
    <section className="container mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center space-y-6"
      >
        {/* Preheader */}
        {preheader && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              "text-sm font-semibold uppercase tracking-wider",
              getPreheaderColor()
            )}
          >
            {preheader}
          </motion.p>
        )}

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] leading-tight"
        >
          {headline}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 max-w-2xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-4"
        >
          <Button
            asChild
            size="lg"
            className={cn(
              "text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300",
              getCtaColor()
            )}
          >
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

