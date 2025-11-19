"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  gradientColor: "yellow" | "purple" | "blue" | "coral" | "mint";
}

interface FeatureGridWithMockupsProps {
  headline?: string;
  features: Feature[];
}

export default function FeatureGridWithMockups({
  headline = "The features Both familiar and new.",
  features,
}: FeatureGridWithMockupsProps) {
  const getGradientClass = (color: Feature["gradientColor"]) => {
    switch (color) {
      case "yellow":
        return "bg-gradient-to-br from-yellow-400/20 via-yellow-300/15 to-yellow-200/10 dark:from-yellow-600/20 dark:via-yellow-500/15 dark:to-yellow-400/10";
      case "purple":
        return "bg-gradient-to-br from-purple-400/20 via-purple-300/15 to-purple-200/10 dark:from-purple-600/20 dark:via-purple-500/15 dark:to-purple-400/10";
      case "blue":
        return "bg-gradient-to-br from-blue-400/20 via-blue-300/15 to-blue-200/10 dark:from-blue-600/20 dark:via-blue-500/15 dark:to-blue-400/10";
      case "coral":
        return "bg-gradient-to-br from-[var(--klutr-coral)]/20 via-[var(--klutr-coral)]/15 to-[var(--klutr-coral)]/10";
      case "mint":
        return "bg-gradient-to-br from-[var(--klutr-mint)]/20 via-[var(--klutr-mint)]/15 to-[var(--klutr-mint)]/10";
      default:
        return "bg-gradient-to-br from-[var(--klutr-coral)]/20 via-[var(--klutr-coral)]/15 to-[var(--klutr-coral)]/10";
    }
  };

  return (
    <section className="container mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
          {headline}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ staggerChildren: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => {
          const gradientClass = getGradientClass(feature.gradientColor);

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
                  "h-full border-[var(--klutr-outline)]/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]",
                  gradientClass
                )}
              >
                <CardHeader className="space-y-4 pb-4">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Device Frame Mockup */}
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white dark:bg-[var(--klutr-surface-dark)] shadow-lg border-2 border-[var(--klutr-outline)]/30">
                    {/* Device Frame Top Bar (notch area) */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 dark:bg-gray-800 border-b border-[var(--klutr-outline)]/20 flex items-center justify-center">
                      <div className="w-16 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    </div>

                    {/* Device Frame Content Area */}
                    <div className="absolute inset-x-0 top-8 bottom-0 p-3">
                      <div className="w-full h-full rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                        <Image
                          src={feature.imageSrc}
                          alt={feature.imageAlt}
                          width={600}
                          height={450}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Device Frame Bottom Bar (home indicator) */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
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

