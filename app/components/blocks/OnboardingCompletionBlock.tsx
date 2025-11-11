"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { OnboardingCompletionBlock as OnboardingCompletionBlockType } from "@/lib/basehub/queries/blocks"
import { cn } from "@/lib/utils"
import { CheckCircle2 } from "lucide-react"

interface OnboardingCompletionBlockProps {
  completion: OnboardingCompletionBlockType
  className?: string
}

/**
 * OnboardingCompletionBlock component
 * 
 * Renders the completion message for onboarding flow.
 * Includes success message and CTA button/link.
 */
export function OnboardingCompletionBlock({
  completion,
  className,
}: OnboardingCompletionBlockProps) {
  if (!completion.message) {
    return null
  }

  return (
    <section
      role="region"
      aria-labelledby="onboarding-completion-message"
      className={cn("text-center space-y-6", className)}
    >
      <Card className="bg-gradient-dark shadow-depth border-[var(--color-accent-mint)]/30">
        <CardContent className="pt-6 space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-[var(--color-accent-mint)]/20 p-4">
              <CheckCircle2
                className="w-12 h-12 text-[var(--color-accent-mint)]"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h2
              id="onboarding-completion-message"
              className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
            >
              {completion.message}
            </h2>
            {completion.ctaText && completion.ctaLink && (
              <Button
                asChild
                className="bg-[var(--color-accent-mint)] hover:bg-[var(--color-accent-mint)]/90 text-[var(--color-primary)] text-lg px-8 py-6 rounded-full shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
                aria-label={completion.ctaText}
              >
                <Link href={completion.ctaLink}>{completion.ctaText}</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

