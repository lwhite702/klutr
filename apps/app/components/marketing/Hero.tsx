"use client"

import { motion } from "framer-motion"
import Link from "next/link"
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
  // Parse headline to highlight first word (e.g., "Clear the clutr. Keep the spark.")
  const parseHeadline = (headline: string | null) => {
    if (!headline) return null
    
    // Split by first period or newline to get first sentence
    const parts = headline.split(/[.\n]/)
    const firstSentence = parts[0]?.trim() || headline
    const rest = parts.slice(1).join(".").trim()
    
    // Extract first word
    const words = firstSentence.split(" ")
    const firstWord = words[0] || ""
    const remainingWords = words.slice(1).join(" ")
    
    return { firstWord, remainingWords, rest }
  }

  const headlineParts = parseHeadline(heroHeadline)

  return (
    <section
      data-bh-collection="pages"
      className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] py-24 md:py-40"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
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
            {headlineParts && (
              <motion.div variants={fadeInUp}>
                <h1
                  data-bh-field="heroHeadline"
                  className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.1] mb-8"
                >
                  <span className="text-[var(--klutr-coral)] font-semibold">
                    {headlineParts.firstWord}
                  </span>{" "}
                  {headlineParts.remainingWords}
                  {headlineParts.rest && (
                    <>
                      <br />
                      <span className="font-normal">{headlineParts.rest}</span>
                    </>
                  )}
                </h1>
              </motion.div>
            )}
            {heroSubtext && (
              <motion.p
                data-bh-field="heroSubtext"
                variants={fadeInUp}
                className="text-xl md:text-2xl text-[var(--klutr-text-primary-light)]/80 dark:text-[var(--klutr-text-primary-dark)]/80 max-w-lg font-light leading-relaxed mb-8"
              >
                {heroSubtext}
              </motion.p>
            )}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              {primaryCTA && (
                <Button
                  data-bh-field="primaryCTA"
                  size="lg"
                  className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white text-lg px-8 py-6 rounded-full"
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
                  variant="ghost"
                  className="text-lg px-8 py-6 rounded-full"
                  asChild
                >
                  <Link href="/login" aria-label={secondaryCTA}>
                    {secondaryCTA}
                  </Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto bg-gradient-to-br from-[var(--klutr-coral)]/10 to-[var(--klutr-mint)]/10 rounded-2xl p-8">
              <div className="bg-white dark:bg-[var(--klutr-surface-dark)] rounded-xl shadow-2xl p-6 h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">📝</div>
                  <p className="text-sm text-muted-foreground">
                    App Mockup
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

