"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface HeroProps {
  heroHeadline: string | null
  heroSubtext: string | null
  primaryCTA: string | null
  secondaryCTA?: string | null
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function Hero({
  heroHeadline,
  heroSubtext,
  primaryCTA,
  secondaryCTA,
}: HeroProps) {
  return (
    <section
      data-bh-collection="pages"
      className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] py-24 md:py-40"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Large left-aligned headline */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              initial: { opacity: 0 },
              animate: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <h1
                data-bh-field="heroHeadline"
                className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[1.1] mb-6 text-left"
              >
                {heroHeadline || "Organize your chaos. Keep the spark."}
              </h1>
            </motion.div>
            {heroSubtext && (
              <motion.p
                data-bh-field="heroSubtext"
                variants={fadeInUp}
                className="text-xl md:text-2xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 max-w-lg font-body leading-relaxed mb-8 text-left"
              >
                {heroSubtext}
              </motion.p>
            )}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              {primaryCTA && (
                <Button
                  data-bh-field="primaryCTA"
                  size="lg"
                  className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white text-lg px-8 py-6 rounded-full shadow-lg"
                  asChild
                >
                  <Link href="/login" aria-label={primaryCTA}>
                    {primaryCTA}
                  </Link>
                </Button>
              )}
              {secondaryCTA && (
                <Button
                  data-bh-field="secondaryCTA"
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-full border-2"
                  asChild
                >
                  <Link href="#features" aria-label={secondaryCTA}>
                    {secondaryCTA}
                  </Link>
                </Button>
              )}
            </motion.div>
          </motion.div>

          {/* Right: Large floating UI mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Floating layered cards showing Stream, panels, and components */}
            <div className="relative w-full max-w-lg mx-auto">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--klutr-coral)]/10 via-[var(--klutr-mint)]/10 to-purple-100/10 dark:to-purple-900/10 rounded-3xl blur-3xl" />
              
              {/* Main card - Stream */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative bg-white dark:bg-[var(--klutr-surface-dark)] rounded-2xl shadow-2xl p-6 border border-[var(--klutr-outline)]/10 z-10"
              >
                <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-[var(--klutr-coral)]/5 to-[var(--klutr-mint)]/5">
                  <Image
                    src="/illustrations/barcelona/Welcome-1--Streamline-Barcelona.svg"
                    alt="Stream interface"
                    width={600}
                    height={400}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                    Stream
                  </p>
                </div>
              </motion.div>

              {/* Overlapping card - MindStorm (top right) */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -top-4 -right-4 w-48 bg-white dark:bg-[var(--klutr-surface-dark)] rounded-xl shadow-xl p-4 border border-[var(--klutr-outline)]/10 z-20"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-[var(--klutr-mint)]/10 to-blue-100/10 dark:to-blue-900/10">
                  <Image
                    src="/illustrations/brooklyn/Success-3--Streamline-Brooklyn.svg"
                    alt="MindStorm clustering"
                    width={200}
                    height={200}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <p className="text-xs font-semibold text-center mt-2 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  MindStorm
                </p>
              </motion.div>

              {/* Overlapping card - Insights (bottom left) */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                  x: [0, -5, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-4 -left-4 w-40 bg-white dark:bg-[var(--klutr-surface-dark)] rounded-xl shadow-xl p-4 border border-[var(--klutr-outline)]/10 z-20"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-100/10 to-[var(--klutr-coral)]/10 dark:from-purple-900/10">
                  <Image
                    src="/illustrations/barcelona/Finding-1--Streamline-Barcelona.svg"
                    alt="Insights panel"
                    width={150}
                    height={150}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <p className="text-xs font-semibold text-center mt-2 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  Insights
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

