"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BetaCTABlockProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  noCardText?: string;
  className?: string;
}

export default function BetaCTABlock({
  headline = "Ready to clear the clutter?",
  subheadline = "Klutr is now in beta — early users get full access for free, plus a guaranteed lifetime discount when we launch.",
  ctaText = "Join the Beta Free",
  ctaLink = "/login",
  noCardText = "No credit card required.",
  className,
}: BetaCTABlockProps) {
  return (
    <section
      className={cn(
        "relative py-24 md:py-32 bg-gradient-to-r from-[var(--klutr-coral)] via-[var(--klutr-coral)]/90 to-[var(--klutr-mint)] overflow-hidden",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center space-y-8 md:space-y-12"
        >
          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            {headline}
          </motion.h2>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl lg:text-3xl text-white/95 leading-relaxed max-w-4xl mx-auto"
          >
            {subheadline}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-4"
          >
            <Button
              size="lg"
              className="bg-white text-[var(--klutr-coral)] hover:bg-gray-100 text-xl md:text-2xl px-10 md:px-12 py-6 md:py-8 rounded-full shadow-2xl font-bold transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </motion.div>

          {/* No credit card text */}
          {noCardText && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base md:text-lg text-white/80 pt-2"
            >
              {noCardText}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}


