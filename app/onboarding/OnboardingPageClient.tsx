"use client"

import { useState, useEffect } from "react"
import {
  OnboardingIntroBlock,
  OnboardingStepBlock,
  OnboardingCompletionBlock,
} from "@/app/components/blocks"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { getOnboardingSteps } from "@/lib/basehub/queries/blocks"

interface OnboardingPageClientProps {
  initialData: Awaited<ReturnType<typeof getOnboardingSteps>>
}

export function OnboardingPageClient({ initialData }: OnboardingPageClientProps) {
  const [currentStep, setCurrentStep] = useState(-1)
  const [isComplete, setIsComplete] = useState(false)

  const { introBlock, steps, completionBlock } = initialData

  const handleStart = () => {
    if (steps.length > 0) {
      setCurrentStep(0)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentStep < steps.length - 1 && currentStep >= 0) {
        handleNext()
      } else if (e.key === "ArrowLeft" && currentStep > 0) {
        handlePrevious()
      }
    }

    if (currentStep >= 0) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentStep, steps.length])

  if (isComplete && completionBlock) {
    return (
      <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <OnboardingCompletionBlock completion={completionBlock} />
        </div>
      </div>
    )
  }

  if (!introBlock && steps.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-[var(--color-text-secondary)]">
            Onboarding content is not available at this time.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)]">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {introBlock && currentStep === -1 && (
            <OnboardingIntroBlock intro={introBlock} onStart={handleStart} />
          )}

          {steps.length > 0 && currentStep >= 0 && (
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <OnboardingStepBlock
                    step={steps[currentStep]}
                    stepNumber={currentStep + 1}
                    totalSteps={steps.length}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
                  aria-label="Previous step"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                  Previous
                </Button>

                <div className="flex items-center gap-2" role="tablist" aria-label="Onboarding progress">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition ${
                        index === currentStep
                          ? "bg-[var(--color-accent-mint)]"
                          : "bg-muted"
                      }`}
                      role="tab"
                      aria-selected={index === currentStep}
                      aria-label={`Step ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  disabled={currentStep >= steps.length - 1}
                  className="bg-[var(--color-accent-mint)] hover:bg-[var(--color-accent-mint)]/90 text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
                  aria-label={currentStep >= steps.length - 1 ? "Complete onboarding" : "Next step"}
                >
                  {currentStep >= steps.length - 1 ? "Complete" : "Next"}
                  {currentStep < steps.length - 1 && (
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

