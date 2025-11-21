"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UIPreviewCard {
  title: string;
  imageSrc: string;
  imageAlt: string;
  offsetX?: number;
  offsetY?: number;
  delay?: number;
}

interface UIPreviewStripProps {
  cards?: UIPreviewCard[];
  className?: string;
}

const defaultCards: UIPreviewCard[] = [
  {
    title: "Stream",
    imageSrc: "/illustrations/barcelona/Welcome-1--Streamline-Barcelona.svg",
    imageAlt: "Stream note feed interface",
    offsetX: 0,
    offsetY: 0,
    delay: 0,
  },
  {
    title: "MindStorm",
    imageSrc: "/illustrations/brooklyn/Success-3--Streamline-Brooklyn.svg",
    imageAlt: "MindStorm clustering view",
    offsetX: 20,
    offsetY: -10,
    delay: 0.2,
  },
  {
    title: "Insights",
    imageSrc: "/illustrations/barcelona/Finding-1--Streamline-Barcelona.svg",
    imageAlt: "Insights panel",
    offsetX: -15,
    offsetY: 10,
    delay: 0.4,
  },
];

export default function UIPreviewStrip({
  cards = defaultCards,
  className,
}: UIPreviewStripProps) {
  return (
    <section
      className={cn(
        "relative py-12 md:py-16 bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] overflow-hidden",
        className
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="relative flex items-center justify-center gap-4 md:gap-8 min-h-[200px] md:min-h-[300px]">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              animate={{
                y: [0, -8, 0],
                rotate: [0, 1, -1, 0],
              }}
              transition={{
                opacity: {
                  duration: 0.6,
                  delay: card.delay || index * 0.15,
                  ease: [0.4, 0, 0.2, 1],
                },
                y: {
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (card.delay || index * 0.15) + 0.6,
                },
                rotate: {
                  duration: 4 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (card.delay || index * 0.15) + 0.6,
                },
                scale: {
                  duration: 0.6,
                  delay: card.delay || index * 0.15,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
              className={cn(
                "relative bg-white dark:bg-[var(--klutr-surface-dark)] rounded-2xl shadow-lg border border-[var(--klutr-outline)]/10 p-4 md:p-6",
                "hover:shadow-2xl transition-shadow duration-300",
                index === 0 && "z-10 w-full max-w-sm",
                index === 1 && "z-20 w-full max-w-xs -ml-8 md:-ml-12",
                index === 2 && "z-30 w-full max-w-xs -ml-6 md:-ml-10"
              )}
              style={{
                transform: `translate(${card.offsetX || 0}px, ${card.offsetY || 0}px)`,
              }}
            >
              <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-[var(--klutr-coral)]/5 via-[var(--klutr-mint)]/5 to-purple-100/5 dark:to-purple-900/5 mb-3">
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  width={400}
                  height={300}
                  className="w-full h-full object-contain p-3"
                />
              </div>
              <p className="text-sm font-semibold text-center text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                {card.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

