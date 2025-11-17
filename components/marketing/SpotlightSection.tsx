"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SpotlightSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  accentColor?: "coral" | "mint";
}

export default function SpotlightSection({
  title,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
  accentColor = "coral",
}: SpotlightSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-6 py-20"
    >
      <div
        className={cn(
          "grid md:grid-cols-2 gap-12 items-center",
          reverse && "md:grid-flow-dense"
        )}
      >
        {/* Text Content */}
        <div className={cn("space-y-6", reverse && "md:col-start-2")}>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            "relative aspect-video md:aspect-square rounded-2xl overflow-hidden",
            reverse && "md:col-start-1 md:row-start-1"
          )}
        >
          <div
            className={cn(
              "absolute inset-0",
              accentColor === "coral"
                ? "bg-gradient-to-br from-[var(--klutr-coral)]/10 to-[var(--klutr-mint)]/10"
                : "bg-gradient-to-br from-[var(--klutr-mint)]/10 to-[var(--klutr-coral)]/10"
            )}
          />
          <div className="relative w-full h-full p-8 flex items-center justify-center">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={600}
              height={600}
              className="object-contain w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

