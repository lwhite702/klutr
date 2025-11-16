"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

interface FeatureModuleProps {
  title: string;
  description: string;
  illustration?: string;
  reverse?: boolean;
}

export default function FeatureModule({
  title,
  description,
  illustration,
  reverse = false,
}: FeatureModuleProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-6 py-16"
    >
      <div
        className={`grid md:grid-cols-2 gap-12 items-center ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className={reverse ? "md:order-2" : ""}>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] mb-6">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 leading-relaxed">
            {description}
          </p>
        </div>
        <div className={reverse ? "md:order-1" : ""}>
          {illustration ? (
            <div className="relative aspect-square max-w-lg mx-auto bg-gradient-to-br from-[var(--klutr-coral)]/10 to-[var(--klutr-mint)]/10 rounded-2xl p-8">
              <div className="bg-white dark:bg-[var(--klutr-surface-dark)] rounded-2xl shadow-2xl p-6 h-full flex items-center justify-center">
                <Image
                  src={illustration}
                  alt={title}
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="relative aspect-square max-w-lg mx-auto bg-gradient-to-br from-[var(--klutr-coral)]/10 to-[var(--klutr-mint)]/10 rounded-2xl p-8">
              <div className="bg-white dark:bg-[var(--klutr-surface-dark)] rounded-2xl shadow-2xl p-6 h-full flex items-center justify-center">
                <div className="text-6xl">💡</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

