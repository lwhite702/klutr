"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OnboardingStepBlock as OnboardingStepBlockType } from "@/lib/basehub/queries/blocks"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface OnboardingStepBlockProps {
  step: OnboardingStepBlockType
  stepNumber: number
  totalSteps: number
  className?: string
}

/**
 * OnboardingStepBlock component
 * 
 * Renders a single step in the onboarding flow.
 * Includes step number, title, description, and optional image.
 */
export function OnboardingStepBlock({
  step,
  stepNumber,
  totalSteps,
  className,
}: OnboardingStepBlockProps) {
  if (!step.title) {
    return null
  }

  const stepId = `onboarding-step-${stepNumber}`

  return (
    <article
      id={stepId}
      role="article"
      aria-labelledby={`${stepId}-title`}
      aria-posinset={stepNumber}
      aria-setsize={totalSteps}
      className={cn("focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-coral", className)}
    >
      <Card className="shadow-depth dark:card-depth">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-accent-mint)] text-[var(--color-primary)] font-bold text-lg"
              aria-hidden="true"
            >
              {stepNumber}
            </div>
            <CardTitle
              id={`${stepId}-title`}
              className="text-xl font-semibold text-[var(--color-text-primary)]"
            >
              {step.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {step.description && (
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              {step.description}
            </p>
          )}
          {step.image && step.image.url && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={step.image.url}
                alt={step.image.altText || step.title || "Step illustration"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </article>
  )
}

