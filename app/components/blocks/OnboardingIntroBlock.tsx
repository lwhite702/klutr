"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { OnboardingIntroBlock as OnboardingIntroBlockType } from "@/lib/basehub/queries/blocks"
import { cn } from "@/lib/utils"

interface OnboardingIntroBlockProps {
  intro: OnboardingIntroBlockType
  onStart?: () => void
  className?: string
}

/**
 * OnboardingIntroBlock component
 * 
 * Renders the introduction section for onboarding flow.
 * Includes headline, description, and CTA button.
 */
export function OnboardingIntroBlock({
  intro,
  onStart,
  className,
}: OnboardingIntroBlockProps) {
  if (!intro.headline) {
    return null
  }

  return (
    <section
      role="region"
      aria-labelledby="onboarding-intro-headline"
      className={cn("text-center space-y-6", className)}
    >
      <Card className="bg-gradient-dark shadow-depth">
        <CardHeader>
          <CardTitle
            id="onboarding-intro-headline"
            className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]"
          >
            {intro.headline}
          </CardTitle>
        </CardHeader>
        {intro.description && (
          <CardContent>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
              {intro.description}
            </p>
          </CardContent>
        )}
        {intro.ctaText && (
          <CardContent>
            <Button
              onClick={onStart}
              className="bg-[var(--color-accent-mint)] hover:bg-[var(--color-accent-mint)]/90 text-[var(--color-primary)] text-lg px-8 py-6 rounded-full shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
              aria-label={intro.ctaText}
            >
              {intro.ctaText}
            </Button>
          </CardContent>
        )}
      </Card>
    </section>
  )
}

