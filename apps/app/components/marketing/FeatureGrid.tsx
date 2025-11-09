"use client"

import { motion } from "framer-motion"
import Link from "next/link"
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
}

export default function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <section
      id="features"
      data-bh-collection="features"
      className="container mx-auto px-6 py-20"
    >
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
        className="space-y-12"
      >
        <motion.div
          variants={fadeInUp}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
            Everything you need to clear the clutr
          </h2>
          <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
            Capture anything. We organize it. You stay creative.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p>No features available. Check BaseHub configuration.</p>
            </div>
          ) : (
            features.map((feature, index) => {
            const Icon = featureIcons[feature.name] || Brain
            return (
              <motion.div key={feature.slug} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow border-[var(--klutr-outline)]/20">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-[var(--klutr-coral)]/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[var(--klutr-coral)]" />
                    </div>
                    <CardTitle data-bh-field="name" className="text-xl">
                      {feature.name}
                    </CardTitle>
                    <CardDescription
                      data-bh-field="tagline"
                      className="text-base text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70"
                    >
                      {feature.tagline}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[var(--klutr-coral)] hover:text-[var(--klutr-coral)]/80"
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
          })
          )}
        </div>
      </motion.div>
    </section>
  )
}

