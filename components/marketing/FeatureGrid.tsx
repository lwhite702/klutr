"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Brain,
  Zap,
  Layers,
  Pen,
  Calendar,
  BookOpen,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { FeatureData } from "@/lib/queries/features"
import { cn } from "@/lib/utils"
import { getFeatureIllustration, getBestIllustrationPath, getIllustrationAltText } from "@/lib/illustrations/mapping"

interface FeatureGridProps {
  features: FeatureData[]
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

// Map feature names to icons
const featureIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  MindStorm: Brain,
  QuickCapture: Zap,
  "Smart Stacks": Layers,
  Stacks: Layers,
  "Write Notes": Pen,
  Notes: Pen,
  "Plan your day": Calendar,
  Planning: Calendar,
  "Learn facts": BookOpen,
  Learning: BookOpen,
  Flux: Zap,
  Orbit: Layers,
  Pulse: Calendar,
  Vault: BookOpen,
  Spark: Brain,
  Muse: Brain,
  Stream: Zap,
  Boards: Layers,
  Search: BookOpen,
}

export default function FeatureGrid({ features }: FeatureGridProps) {
  if (features.length === 0) {
    return (
      <section
        id="features"
        data-bh-collection="features"
        className="container mx-auto px-6 py-20"
      >
        <div className="text-center py-12 text-muted-foreground">
          <p>No features available. Check BaseHub configuration.</p>
        </div>
      </section>
    )
  }

  // Split features into groups for different layouts
  // First 2-3 features get full-width alternating layout
  // Remaining features get card grid layout
  const featuredFeatures = features.slice(0, 3)
  const gridFeatures = features.slice(3)

  return (
    <section
      id="features"
      data-bh-collection="features"
      className="relative py-20 overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--klutr-mint)]/5 via-transparent to-[var(--klutr-coral)]/5 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            className="text-center space-y-4 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
              Everything you need to organize your chaos
            </h2>
            <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
              Capture anything. We organize it. You stay creative.
            </p>
          </motion.div>

          {/* Full-width alternating feature sections */}
          <div className="space-y-0">
            {featuredFeatures.map((feature, index) => {
              const Icon = featureIcons[feature.name] || Brain
              const illustrationMapping = getFeatureIllustration(feature.name)
              const illustrationPath = illustrationMapping.primary 
                ? getBestIllustrationPath(illustrationMapping.primary)
                : null
              const illustrationAlt = illustrationMapping.primary
                ? getIllustrationAltText(illustrationMapping.primary)
                : `${feature.name} illustration`
              const isEven = index % 2 === 0
              const bgGradient = isEven
                ? "bg-gradient-to-r from-[var(--klutr-mint)]/10 via-[var(--klutr-mint)]/5 to-transparent"
                : "bg-gradient-to-l from-[var(--klutr-coral)]/10 via-[var(--klutr-coral)]/5 to-transparent"
              
              return (
                <motion.div
                  key={feature.slug}
                  variants={fadeInUp}
                  className={cn(
                    "relative rounded-3xl overflow-hidden mb-8 md:mb-12",
                    bgGradient
                  )}
                >
                  <div
                    className={cn(
                      "container mx-auto px-6 py-12 md:py-16",
                      "flex flex-col md:flex-row items-center gap-8 md:gap-12",
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                  >
                    {/* Content */}
                    <div className={cn(
                      "flex-1 space-y-4",
                      isEven ? "md:text-left" : "md:text-right"
                    )}>
                      <div className="inline-flex items-center gap-3 mb-4">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center",
                          "bg-gradient-to-br shadow-lg",
                          isEven
                            ? "from-[var(--klutr-mint)]/20 to-[var(--klutr-mint)]/10"
                            : "from-[var(--klutr-coral)]/20 to-[var(--klutr-coral)]/10"
                        )}>
                          <Icon className={cn(
                            "w-8 h-8",
                            isEven ? "text-[var(--klutr-mint)]" : "text-[var(--klutr-coral)]"
                          )} />
                        </div>
                      </div>
                      <h3
                        data-bh-field="name"
                        className="text-2xl md:text-3xl font-display font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]"
                      >
                        {feature.name}
                      </h3>
                      <p
                        data-bh-field="tagline"
                        className="text-lg text-[var(--klutr-text-primary-light)]/80 dark:text-[var(--klutr-text-primary-dark)]/80 leading-relaxed"
                      >
                        {feature.tagline}
                      </p>
                      <Button
                        variant="ghost"
                        size="lg"
                        className={cn(
                          "rounded-2xl mt-4",
                          isEven
                            ? "text-[var(--klutr-mint)] hover:text-[var(--klutr-mint)]/80 hover:bg-[var(--klutr-mint)]/10"
                            : "text-[var(--klutr-coral)] hover:text-[var(--klutr-coral)]/80 hover:bg-[var(--klutr-coral)]/10"
                        )}
                        asChild
                      >
                        <Link
                          href={`/features/${feature.slug}`}
                          aria-label={`Learn more about ${feature.name}`}
                        >
                          Learn More <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>

                    {/* Visual element / Illustration or Icon area */}
                    <div className={cn(
                      "flex-1 flex items-center justify-center",
                      isEven ? "md:justify-end" : "md:justify-start"
                    )}>
                      <div className={cn(
                        "w-32 h-32 md:w-48 md:h-48 rounded-3xl flex items-center justify-center",
                        "bg-gradient-to-br shadow-2xl transform transition-transform duration-300 hover:scale-105",
                        isEven
                          ? "from-[var(--klutr-mint)]/30 to-[var(--klutr-mint)]/10"
                          : "from-[var(--klutr-coral)]/30 to-[var(--klutr-coral)]/10"
                      )}>
                        {illustrationPath ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={illustrationPath}
                              alt={illustrationAlt}
                              fill
                              className="object-contain p-4"
                              sizes="(max-width: 768px) 128px, 192px"
                            />
                          </div>
                        ) : (
                          <Icon className={cn(
                            "w-16 h-16 md:w-24 md:h-24",
                            isEven ? "text-[var(--klutr-mint)]" : "text-[var(--klutr-coral)]"
                          )} />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Card grid for remaining features */}
          {gridFeatures.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
              {gridFeatures.map((feature, index) => {
                const Icon = featureIcons[feature.name] || Brain
                const illustrationMapping = getFeatureIllustration(feature.name)
                const illustrationPath = illustrationMapping.primary 
                  ? getBestIllustrationPath(illustrationMapping.primary)
                  : null
                const illustrationAlt = illustrationMapping.primary
                  ? getIllustrationAltText(illustrationMapping.primary)
                  : `${feature.name} illustration`
                const colorVariants = [
                  { bg: "from-[var(--klutr-mint)]/10", icon: "text-[var(--klutr-mint)]", border: "border-[var(--klutr-mint)]/20" },
                  { bg: "from-[var(--klutr-coral)]/10", icon: "text-[var(--klutr-coral)]", border: "border-[var(--klutr-coral)]/20" },
                  { bg: "from-[var(--klutr-mint)]/10", icon: "text-[var(--klutr-mint)]", border: "border-[var(--klutr-mint)]/20" },
                ]
                const variant = colorVariants[index % colorVariants.length]
                
                return (
                  <motion.div key={feature.slug} variants={fadeInUp}>
                    <Card className={cn(
                      "h-full hover:shadow-2xl transition-all duration-300 rounded-2xl shadow-lg group",
                      "border-2 hover:border-opacity-40",
                      variant.border,
                      "bg-gradient-to-br from-background to-muted/30"
                    )}>
                      <CardHeader>
                        <div className={cn(
                          "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4",
                          "group-hover:scale-110 transition-transform duration-300 shadow-md",
                          variant.bg
                        )}>
                          {illustrationPath ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={illustrationPath}
                                alt={illustrationAlt}
                                fill
                                className="object-contain p-2"
                                sizes="56px"
                              />
                            </div>
                          ) : (
                            <Icon className={cn("w-7 h-7", variant.icon)} />
                          )}
                        </div>
                        <CardTitle data-bh-field="name" className="text-xl font-display">
                          {feature.name}
                        </CardTitle>
                        <CardDescription
                          data-bh-field="tagline"
                          className="text-base font-body text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70"
                        >
                          {feature.tagline}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "rounded-2xl",
                            variant.icon,
                            `hover:${variant.bg.replace('/10', '/20')}`
                          )}
                          asChild
                        >
                          <Link
                            href={`/features/${feature.slug}`}
                            aria-label={`Learn more about ${feature.name}`}
                          >
                            Learn More <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
