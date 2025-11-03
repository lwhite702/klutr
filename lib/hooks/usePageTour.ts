"use client"

import { useState, useEffect } from "react"
import { hasPageTourSeen, markPageTourSeen, isDemoMode, type PageId } from "@/lib/onboarding"

export interface TourStep {
  id: string
  title: string
  description: string
  targetId?: string
  position?: "top" | "bottom" | "left" | "right"
}

export function usePageTour(pageId: PageId, steps: TourStep[]) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Auto-start tour if user hasn't seen it yet or in demo mode
    const shouldShowTour = isDemoMode() || !hasPageTourSeen(pageId)
    if (shouldShowTour && currentStep === 0) {
      setIsActive(true)
    }
  }, [pageId, currentStep])

  const startTour = () => {
    setIsActive(true)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      endTour()
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const skipTour = () => {
    endTour()
  }

  const endTour = () => {
    setIsActive(false)
    setCurrentStep(0)
    markPageTourSeen(pageId)
  }

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  return {
    currentStep,
    currentStepData,
    isActive,
    isLastStep,
    isFirstStep,
    totalSteps: steps.length,
    startTour,
    nextStep,
    previousStep,
    skipTour,
    endTour,
  }
}
