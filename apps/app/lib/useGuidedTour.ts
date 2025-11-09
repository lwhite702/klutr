"use client"

import { useState, useEffect } from "react"
import { hasTourSeen, markTourSeen, isDemoMode } from "./onboarding"

export function useGuidedTour(noteCount: number) {
  const [step, setStep] = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    // Auto-start tour if:
    // - Demo mode is on (always show tour in demo)
    // - OR user hasn't seen tour and has < 3 notes
    const shouldShowTour = isDemoMode() || (!hasTourSeen() && noteCount < 3)
    if (shouldShowTour && step === 0) {
      setActive(true)
    }
  }, [noteCount, step])

  const startTour = () => {
    setActive(true)
    setStep(1)
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
  }

  const endTour = () => {
    setActive(false)
    setStep(0)
    markTourSeen()
  }

  return {
    step,
    active,
    startTour,
    nextStep,
    endTour,
  }
}
