"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { usePageTour, type TourStep } from "@/lib/hooks/usePageTour"
import type { PageId } from "@/lib/onboarding"

interface PageTourProps {
  pageId: PageId
  steps: TourStep[]
}

export function PageTour({ pageId, steps }: PageTourProps) {
  const {
    currentStepData,
    isActive,
    isLastStep,
    isFirstStep,
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    skipTour,
  } = usePageTour(pageId, steps)

  if (!isActive || !currentStepData) return null

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={skipTour}
          />

          {/* Tour Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <Card className="p-6 shadow-2xl border-2 border-[var(--color-indigo)]/30 bg-card">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[var(--color-indigo)]/10">
                    <Sparkles className="h-4 w-4 text-[var(--color-indigo)]" />
                  </div>
                  <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mt-1 -mr-1"
                  onClick={skipTour}
                  aria-label="Close tour"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {currentStepData.description}
              </p>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Step {currentStep + 1} of {totalSteps}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentStep
                            ? "w-6 bg-[var(--color-indigo)]"
                            : index < currentStep
                            ? "w-1.5 bg-[var(--color-indigo)]/40"
                            : "w-1.5 bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!isFirstStep && (
                    <Button variant="outline" size="sm" onClick={previousStep}>
                      <ArrowLeft className="h-3 w-3 mr-1" />
                      Back
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={nextStep}
                    className="bg-[var(--color-indigo)] hover:bg-[var(--color-indigo)]/90 text-[var(--color-indigo-foreground)]"
                  >
                    {isLastStep ? (
                      "Got it!"
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
