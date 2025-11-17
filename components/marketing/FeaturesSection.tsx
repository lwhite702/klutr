"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface Feature {
  iconName: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  backgroundColor?: "coral" | "mint" | "yellow" | "purple";
}

interface FeaturesSectionProps {
  headline?: string;
  subheadline?: string;
  features: Feature[];
  columns?: 2 | 3;
}

export default function FeaturesSection({
  headline = "The features both familiar and new",
  subheadline,
  features,
  columns = 2,
}: FeaturesSectionProps) {
  const gridClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
  };

  const getBackgroundColor = (color?: string) => {
    switch (color) {
      case "coral":
        return "bg-gradient-to-br from-[var(--klutr-coral)]/10 to-[var(--klutr-coral)]/5";
      case "mint":
        return "bg-gradient-to-br from-[var(--klutr-mint)]/10 to-[var(--klutr-mint)]/5";
      case "yellow":
        return "bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/10";
      case "purple":
        return "bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/10";
      default:
        return "bg-gradient-to-br from-[var(--klutr-coral)]/10 to-[var(--klutr-mint)]/5";
    }
  };

  return (
    <section className="container mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
          {headline}
        </h2>
        {subheadline && (
          <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 max-w-2xl mx-auto">
            {subheadline}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ staggerChildren: 0.15 }}
        className={cn("grid gap-8", gridClasses[columns])}
      >
        {features.map((feature, index) => {
          const IconComponent = (LucideIcons as any)[feature.iconName];
          const bgColor = getBackgroundColor(feature.backgroundColor);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "h-full border-[var(--klutr-outline)]/20 overflow-hidden transition-all duration-300 hover:shadow-xl",
                  bgColor
                )}
              >
                <CardHeader className="space-y-4">
                  {/* Icon */}
                  {IconComponent && (
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-[var(--klutr-surface-dark)] flex items-center justify-center shadow-md">
                      <IconComponent className="w-8 h-8 text-[var(--klutr-coral)]" />
                    </div>
                  )}

                  {/* Title and Description */}
                  <div className="space-y-2">
                    <CardTitle className="text-2xl text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Screenshot/Illustration in Device Frame */}
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white dark:bg-[var(--klutr-surface-dark)] shadow-lg border border-[var(--klutr-outline)]/20">
                    <div className="absolute inset-0 p-2">
                      <div className="w-full h-full rounded-md overflow-hidden bg-gray-50 dark:bg-gray-900">
                        <Image
                          src={feature.imageSrc}
                          alt={feature.imageAlt}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    {/* Device Frame Decoration */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

