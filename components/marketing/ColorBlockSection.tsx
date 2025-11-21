"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ColorBlockSectionProps {
  backgroundColor: "coral" | "teal" | "softNeutral" | "purple" | "yellow";
  title: string;
  description: string;
  bullets?: string[];
  imageSrc: string;
  imageAlt: string;
  ctaText?: string;
  ctaLink?: string;
  reversed?: boolean; // If true, image on left, text on right
  className?: string;
}

const colorMap = {
  coral: {
    bg: "bg-[var(--klutr-coral)]",
    bgLight: "bg-[var(--klutr-coral)]/10",
    text: "text-white",
    textMuted: "text-white/90",
  },
  teal: {
    bg: "bg-[var(--klutr-mint)]",
    bgLight: "bg-[var(--klutr-mint)]/10",
    text: "text-white",
    textMuted: "text-white/90",
  },
  softNeutral: {
    bg: "bg-[#F7F7F9] dark:bg-[var(--klutr-surface-dark)]",
    bgLight: "bg-[#F7F7F9] dark:bg-[var(--klutr-surface-dark)]",
    text: "text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]",
    textMuted: "text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70",
  },
  purple: {
    bg: "bg-purple-600 dark:bg-purple-700",
    bgLight: "bg-purple-100/20 dark:bg-purple-900/20",
    text: "text-white",
    textMuted: "text-white/90",
  },
  yellow: {
    bg: "bg-yellow-400 dark:bg-yellow-500",
    bgLight: "bg-yellow-100/20 dark:bg-yellow-900/20",
    text: "text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]",
    textMuted: "text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70",
  },
};

export default function ColorBlockSection({
  backgroundColor,
  title,
  description,
  bullets = [],
  imageSrc,
  imageAlt,
  ctaText,
  ctaLink,
  reversed = false,
  className,
}: ColorBlockSectionProps) {
  const colors = colorMap[backgroundColor];

  return (
    <section
      className={cn(
        "relative py-20 md:py-32 overflow-hidden",
        colors.bg,
        className
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div
          className={cn(
            "grid md:grid-cols-2 gap-12 md:gap-16 items-center",
            reversed && "md:grid-flow-dense"
          )}
        >
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "space-y-6 md:space-y-8",
              reversed && "md:col-start-2"
            )}
          >
            <h2
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight",
                colors.text
              )}
            >
              {title}
            </h2>
            <p
              className={cn(
                "text-xl md:text-2xl leading-relaxed",
                colors.textMuted
              )}
            >
              {description}
            </p>
            {bullets.length > 0 && (
              <ul className="space-y-3">
                {bullets.map((bullet, index) => (
                  <li
                    key={index}
                    className={cn(
                      "flex items-start gap-3 text-lg md:text-xl",
                      colors.textMuted
                    )}
                  >
                    <span className="mt-1.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
            {ctaText && (
              <div className="pt-4">
                {ctaLink ? (
                  <Button
                    size="lg"
                    className={cn(
                      "bg-white text-[var(--klutr-coral)] hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg",
                      backgroundColor === "coral" &&
                        "bg-white text-[var(--klutr-coral)]",
                      backgroundColor === "teal" &&
                        "bg-white text-[var(--klutr-mint)]",
                      backgroundColor === "softNeutral" &&
                        "bg-[var(--klutr-coral)] text-white hover:bg-[var(--klutr-coral)]/90",
                      backgroundColor === "purple" &&
                        "bg-white text-purple-600",
                      backgroundColor === "yellow" &&
                        "bg-[var(--klutr-coral)] text-white hover:bg-[var(--klutr-coral)]/90"
                    )}
                    asChild
                  >
                    <Link href={ctaLink}>{ctaText}</Link>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className={cn(
                      "bg-white text-[var(--klutr-coral)] hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg",
                      backgroundColor === "coral" &&
                        "bg-white text-[var(--klutr-coral)]",
                      backgroundColor === "teal" &&
                        "bg-white text-[var(--klutr-mint)]",
                      backgroundColor === "softNeutral" &&
                        "bg-[var(--klutr-coral)] text-white hover:bg-[var(--klutr-coral)]/90",
                      backgroundColor === "purple" &&
                        "bg-white text-purple-600",
                      backgroundColor === "yellow" &&
                        "bg-[var(--klutr-coral)] text-white hover:bg-[var(--klutr-coral)]/90"
                    )}
                  >
                    {ctaText}
                  </Button>
                )}
              </div>
            )}
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: reversed ? -50 : 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "relative",
              reversed && "md:col-start-1 md:row-start-1"
            )}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[var(--klutr-surface-dark)] border border-[var(--klutr-outline)]/10">
              <div className="aspect-[4/3] relative">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-contain p-8"
                />
              </div>
              {/* Floating accent */}
              <motion.div
                className={cn(
                  "absolute -bottom-4 -right-4 w-32 h-32 rounded-full blur-3xl opacity-30",
                  backgroundColor === "coral" && "bg-[var(--klutr-coral)]",
                  backgroundColor === "teal" && "bg-[var(--klutr-mint)]",
                  backgroundColor === "purple" && "bg-purple-600",
                  backgroundColor === "yellow" && "bg-yellow-400"
                )}
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


