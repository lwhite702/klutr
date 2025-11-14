"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Sparkles, Zap, Layers, Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { HowItWorksBlock } from "@/lib/basehub/queries/blocks"
import { getBestIllustrationPath, getIllustrationAltText, getArrowFlowIllustration } from "@/lib/illustrations/mapping"

interface HowItWorksProps {
  howItWorksBlock?: HowItWorksBlock | null
}

// Default steps if BaseHub content not available
const defaultSteps: Array<{
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: "coral" | "mint"
  illustrationUseCase?: 'drop-step' | 'organize-step' | 'discover-step'
}> = [
  {
    title: "Drop",
    description: "Add notes, files, or voice recordings to your Stream. Chat-style interface, zero friction.",
    icon: Zap,
    color: "coral",
    illustrationUseCase: 'drop-step',
  },
  {
    title: "Organize",
    description: "AI automatically tags your drops and groups them into Boards. No manual filing required.",
    icon: Layers,
    color: "mint",
    illustrationUseCase: 'organize-step',
  },
  {
    title: "Discover",
    description: "Muse provides weekly insights. Search finds connections. Turn chaos into clarity.",
    icon: Search,
    color: "coral",
    illustrationUseCase: 'discover-step',
  },
]

export default function HowItWorks({ howItWorksBlock }: HowItWorksProps) {
  // Map BaseHub steps to our format, or use defaults
  const steps = howItWorksBlock?.steps?.map((step, index) => {
    // Use default step configuration
    const defaultStep = defaultSteps[index] || defaultSteps[0]
    // Try to get illustration path for this step
    const illustrationPath = defaultStep.illustrationUseCase
      ? getBestIllustrationPath(defaultStep.illustrationUseCase)
      : null
    const illustrationAlt = defaultStep.illustrationUseCase
      ? getIllustrationAltText(defaultStep.illustrationUseCase)
      : `${step.title || `Step ${index + 1}`} illustration`
    
    return {
      title: step.title || `Step ${index + 1}`,
      description: step.description || "",
      icon: defaultStep.icon, // Fallback icon component
      illustrationPath: step.icon?.url || illustrationPath, // Use BaseHub icon URL if available, otherwise use mapped illustration
      illustrationAlt: step.icon?.altText || illustrationAlt,
      color: (index % 2 === 0 ? "coral" : "mint") as "coral" | "mint",
    }
  }) || defaultSteps.map(step => {
    const illustrationPath = step.illustrationUseCase
      ? getBestIllustrationPath(step.illustrationUseCase)
      : null
    const illustrationAlt = step.illustrationUseCase
      ? getIllustrationAltText(step.illustrationUseCase)
      : `${step.title} illustration`
    return {
      ...step,
      illustrationPath,
      illustrationAlt,
    }
  })

  const heading = howItWorksBlock?.heading || "How It Works"
  const subtitle = "Drop, tag, board, discover—effortlessly"

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--klutr-mint)]/5 to-[var(--klutr-coral)]/5 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { staggerChildren: 0.3 },
            },
          }}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-[var(--klutr-coral)]" />
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                {heading}
              </h2>
            </div>
            <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
              {subtitle}
            </p>
          </motion.div>

          {/* Desktop: Horizontal Process Flow */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--klutr-mint)]/30 via-[var(--klutr-coral)]/30 to-[var(--klutr-mint)]/30 transform -translate-y-1/2" />
              
              <div className="grid grid-cols-3 gap-8 relative">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isMint = step.color === "mint"
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className="relative"
                    >
                      {/* Step number badge */}
                      <div className={cn(
                        "absolute -top-4 left-1/2 transform -translate-x-1/2",
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        "text-lg font-bold shadow-lg z-10",
                        isMint
                          ? "bg-[var(--klutr-mint)] text-[var(--color-primary)]"
                          : "bg-[var(--klutr-coral)] text-white"
                      )}>
                        {index + 1}
                      </div>

                      {/* Arrow between steps (except last) */}
                      {index < steps.length - 1 && (
                        <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                          <ArrowRight className={cn(
                            "w-6 h-6",
                            isMint ? "text-[var(--klutr-mint)]" : "text-[var(--klutr-coral)]"
                          )} />
                        </div>
                      )}

                      <Card className={cn(
                        "h-full border-2 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300",
                        "bg-gradient-to-br from-background to-muted/20",
                        "pt-8 pb-6",
                        isMint
                          ? "border-[var(--klutr-mint)]/30 hover:border-[var(--klutr-mint)]/50"
                          : "border-[var(--klutr-coral)]/30 hover:border-[var(--klutr-coral)]/50"
                      )}>
                        <CardHeader className="text-center space-y-4">
                          <div className={cn(
                            "w-20 h-20 mx-auto rounded-2xl flex items-center justify-center",
                            "bg-gradient-to-br shadow-lg",
                            isMint
                              ? "from-[var(--klutr-mint)]/20 to-[var(--klutr-mint)]/10"
                              : "from-[var(--klutr-coral)]/20 to-[var(--klutr-coral)]/10"
                          )}>
                            {step.illustrationPath ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={step.illustrationPath}
                                  alt={step.illustrationAlt || `${step.title} illustration`}
                                  fill
                                  className="object-contain p-3"
                                  sizes="80px"
                                />
                              </div>
                            ) : (
                              <Icon className={cn(
                                "w-10 h-10",
                                isMint ? "text-[var(--klutr-mint)]" : "text-[var(--klutr-coral)]"
                              )} />
                            )}
                          </div>
                          <CardTitle className="text-2xl font-display">
                            {step.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 leading-relaxed">
                            {step.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile: Vertical Timeline */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isMint = step.color === "mint"
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative pl-12"
                >
                  {/* Timeline line */}
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "absolute left-5 top-12 bottom-0 w-0.5",
                      isMint
                        ? "bg-gradient-to-b from-[var(--klutr-mint)]/50 to-[var(--klutr-coral)]/50"
                        : "bg-gradient-to-b from-[var(--klutr-coral)]/50 to-[var(--klutr-mint)]/50"
                    )} />
                  )}

                  {/* Step number */}
                  <div className={cn(
                    "absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center",
                    "text-sm font-bold shadow-md z-10",
                    isMint
                      ? "bg-[var(--klutr-mint)] text-[var(--color-primary)]"
                      : "bg-[var(--klutr-coral)] text-white"
                  )}>
                    {index + 1}
                  </div>

                  <Card className={cn(
                    "border-2 rounded-2xl shadow-lg",
                    "bg-gradient-to-br from-background to-muted/20",
                    isMint
                      ? "border-[var(--klutr-mint)]/30"
                      : "border-[var(--klutr-coral)]/30"
                  )}>
                    <CardHeader>
                      <div className={cn(
                        "w-16 h-16 rounded-xl flex items-center justify-center mb-4",
                        "bg-gradient-to-br",
                        isMint
                          ? "from-[var(--klutr-mint)]/20 to-[var(--klutr-mint)]/10"
                          : "from-[var(--klutr-coral)]/20 to-[var(--klutr-coral)]/10"
                      )}>
                        {step.illustrationPath ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={step.illustrationPath}
                              alt={step.illustrationAlt || `${step.title} illustration`}
                              fill
                              className="object-contain p-2"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <Icon className={cn(
                            "w-8 h-8",
                            isMint ? "text-[var(--klutr-mint)]" : "text-[var(--klutr-coral)]"
                          )} />
                        )}
                      </div>
                      <CardTitle className="text-xl font-display">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center pt-4"
          >
            <Button
              size="lg"
              className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white rounded-2xl px-8"
              asChild
            >
              <Link href="/login" aria-label="Get started with Klutr">
                Get Started
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

