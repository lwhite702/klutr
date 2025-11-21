"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FinalCTAStripProps {
  text?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

export default function FinalCTAStrip({
  text = "Still deciding? Join Klutr free during beta and help shape the future of thought organization.",
  ctaText = "Get Early Access",
  ctaLink = "/login",
  className,
}: FinalCTAStripProps) {
  return (
    <section
      className={cn(
        "relative py-16 md:py-20 bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)]",
        className
      )}
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center space-y-6"
        >
          <p className="text-lg md:text-xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 leading-relaxed">
            {text}
          </p>
          <Button
            size="lg"
            className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white text-lg px-8 py-6 rounded-full shadow-lg"
            asChild
          >
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}


