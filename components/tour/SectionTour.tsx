"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { hasSectionTourSeen, markSectionTourSeen } from "@/lib/onboarding"
import { cn } from "@/lib/utils"

export interface TourStep {
  id: string
  targetId?: string // Element ID to highlight
  title: string
  description: string
  position?: "top" | "bottom" | "left" | "right"
  action?: () => void // Optional action to perform (e.g., scroll to element)
}

interface SectionTourProps {
  section: string // "notes", "mindstorm", etc.
  steps: TourStep[]
  autoStart?: boolean
  onComplete?: () => void
}

export function SectionTour({ section, steps, autoStart = false, onComplete }: SectionTourProps) {
  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const targetRefs = useRef<Map<string, HTMLElement>>(new Map())

  useEffect(() => {
    if (autoStart && !hasSectionTourSeen(section)) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        setIsActive(true)
        setCurrentStep(0)
      }, 500)
    }
  }, [autoStart, section])

  useEffect(() => {
    if (isActive && currentStep !== null) {
      const step = steps[currentStep]
      if (step.targetId) {
        // Register target element
        const element = document.getElementById(step.targetId)
        if (element) {
          targetRefs.current.set(step.id, element)
          // Scroll into view if needed
          element.scrollIntoView({ behavior: "smooth", block: "center" })
          // Execute optional action
          step.action?.()
        }
      }
    }
  }, [isActive, currentStep, steps])

  const startTour = () => {
    setIsActive(true)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep !== null && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      endTour()
    }
  }

  const endTour = () => {
    setIsActive(false)
    setCurrentStep(null)
    markSectionTourSeen(section)
    onComplete?.()
  }

  const currentStepData = currentStep !== null ? steps[currentStep] : null
  const targetElement = currentStepData?.targetId
    ? targetRefs.current.get(currentStepData.id) || document.getElementById(currentStepData.targetId)
    : null

  // Get element position using getBoundingClientRect for viewport-relative positioning
  const elementRect = targetElement?.getBoundingClientRect()

  if (!isActive || currentStep === null || !currentStepData) {
    return null
  }

  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  }

  const position = currentStepData.position || "bottom"

  // Calculate tooltip position based on element rect
  const getTooltipStyle = () => {
    if (!elementRect) return {}
    
    const spacing = 8
    switch (position) {
      case "bottom":
        return {
          top: `${elementRect.bottom + spacing}px`,
          left: `${elementRect.left + elementRect.width / 2}px`,
          transform: "translateX(-50%)",
        }
      case "top":
        return {
          bottom: `${window.innerHeight - elementRect.top + spacing}px`,
          left: `${elementRect.left + elementRect.width / 2}px`,
          transform: "translateX(-50%)",
        }
      case "right":
        return {
          left: `${elementRect.right + spacing}px`,
          top: `${elementRect.top + elementRect.height / 2}px`,
          transform: "translateY(-50%)",
        }
      case "left":
        return {
          right: `${window.innerWidth - elementRect.left + spacing}px`,
          top: `${elementRect.top + elementRect.height / 2}px`,
          transform: "translateY(-50%)",
        }
      default:
        return {}
    }
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Highlight overlay for target element */}
      {elementRect && (
        <div
          className="fixed z-40 pointer-events-none"
          style={{
            top: elementRect.top - 4,
            left: elementRect.left - 4,
            width: elementRect.width + 8,
            height: elementRect.height + 8,
            border: "2px solid hsl(var(--color-brand-indigo))",
            borderRadius: "calc(var(--radius) + 2px)",
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.3)",
          }}
        />
      )}

      {/* Tour callout */}
      <AnimatePresence>
        {isActive && currentStepData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "fixed z-50",
              elementRect ? "" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            )}
            style={elementRect ? getTooltipStyle() : {}}
          >
            <Card className="p-4 max-w-xs shadow-lg border-2" style={{ borderColor: "hsl(var(--color-brand-indigo) / 0.3)" }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm">{currentStepData.title}</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" onClick={endTour}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{currentStepData.description}</p>
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {currentStep + 1} of {steps.length}
                </span>
                <div className="flex gap-2">
                  {currentStep < steps.length - 1 ? (
                    <Button size="sm" onClick={nextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button size="sm" onClick={endTour}>
                      Done
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
