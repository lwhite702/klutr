"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface SpotlightFeature {
  id: string;
  preheader?: string;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaAction?: () => void;
}

interface SpotlightSectionProps {
  features?: SpotlightFeature[];
  className?: string;
  accentColor?: "coral" | "mint" | "default";
}

const accentColorMap = {
  coral: {
    text: "text-[#FF6B6B]",
    bg: "bg-[#FF6B6B]",
    border: "border-[#FF6B6B]",
    gradient: "from-[#FF6B6B] to-[#FF8E8E]",
  },
  mint: {
    text: "text-[#00C896]",
    bg: "bg-[#00C896]",
    border: "border-[#00C896]",
    gradient: "from-[#00C896] to-[#00E5B8]",
  },
  default: {
    text: "text-primary",
    bg: "bg-primary",
    border: "border-primary",
    gradient: "from-primary to-primary/80",
  },
};

const SpotlightSection: React.FC<SpotlightSectionProps> = ({
  features = [],
  className,
  accentColor = "default",
}) => {
  const colors = accentColorMap[accentColor];


  return (
    <section className={cn("relative py-16 md:py-24 bg-background overflow-hidden", className)}>
      <motion.div
        className="container max-w-7xl mx-auto px-4 md:px-6 space-y-24 md:space-y-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.3 }}
      >
        {features.map((feature, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <div
              key={feature.id}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center",
                isReversed && "lg:grid-flow-dense"
              )}
            >
              {/* Text Content */}
              <motion.div
                className={cn(
                  "flex flex-col space-y-4 md:space-y-6",
                  isReversed && "lg:col-start-2"
                )}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >
                {feature.preheader && (
                  <span className={cn("text-sm font-semibold uppercase tracking-wider", colors.text)}>
                    {feature.preheader}
                  </span>
                )}

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  {feature.title}
                </h2>

                <div className="text-base md:text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 leading-relaxed">
                  {feature.description}
                </div>

                {feature.ctaText && (
                  <div className="pt-2">
                    {feature.ctaLink ? (
                      <Button
                        size="lg"
                        asChild
                        className={cn(
                          "bg-gradient-to-r text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300",
                          `bg-gradient-to-r ${colors.gradient}`
                        )}
                      >
                        <Link href={feature.ctaLink}>
                          {feature.ctaText}
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        onClick={feature.ctaAction}
                        className={cn(
                          "bg-gradient-to-r text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300",
                          `bg-gradient-to-r ${colors.gradient}`
                        )}
                      >
                        {feature.ctaText}
                      </Button>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Image Content */}
              <motion.div
                className={cn(
                  "relative w-full",
                  isReversed && "lg:col-start-1 lg:row-start-1"
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
                  {/* Decorative Background */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 opacity-10",
                      colors.bg
                    )}
                    initial={{ scale: 1.2, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                  />
                  
                  {/* Main Image */}
                  <div className="relative w-full aspect-[4/3] flex items-center justify-center p-8">
                    <Image
                      src={feature.imageSrc}
                      alt={feature.imageAlt || (typeof feature.title === 'string' ? feature.title : 'Feature illustration')}
                      width={800}
                      height={600}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Floating Accent */}
                  <motion.div
                    className={cn(
                      "absolute -bottom-4 -right-4 w-32 h-32 rounded-full blur-3xl opacity-30",
                      colors.bg
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
          );
        })}
      </motion.div>

      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default SpotlightSection;
