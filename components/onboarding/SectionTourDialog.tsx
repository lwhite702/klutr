"use client";

import { Fragment, useEffect, useRef } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TourStep } from "@/lib/hooks/useSectionExperience";

interface SectionTourDialogProps {
  title: string;
  subtitle?: string;
  accent?: "indigo" | "lime" | "coral";
  tour: {
    open: boolean;
    setOpen: (open: boolean) => void;
    steps: TourStep[];
    currentStepIndex: number;
    currentStep?: TourStep;
    totalSteps: number;
    ready?: boolean;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    skipTour: () => void;
    finishTour: () => void;
  };
}

const accentMap = {
  indigo: "var(--brand-indigo)",
  lime: "var(--brand-lime)",
  coral: "var(--brand-coral)",
};

export function SectionTourDialog({
  title,
  subtitle,
  accent = "indigo",
  tour,
}: SectionTourDialogProps) {
  // Prop validation and TypeScript guards
  if (!tour) {
    console.warn("[SectionTourDialog] tour prop is required");
    return null;
  }

  const {
    open,
    setOpen,
    steps,
    currentStep,
    currentStepIndex,
    totalSteps,
    ready = true,
    goToNextStep,
    goToPreviousStep,
    skipTour,
    finishTour,
  } = tour;

  // Validate steps array
  if (!Array.isArray(steps) || steps.length === 0) {
    console.warn("[SectionTourDialog] steps must be a non-empty array");
    return null;
  }

  // Validate currentStepIndex bounds
  const safeStepIndex = Math.max(
    0,
    Math.min(currentStepIndex, steps.length - 1)
  );

  // Validate accent color
  const validAccent = accent && accentMap[accent] ? accent : "indigo";
  const accentColor = accentMap[validAccent];
  const isLastStep = safeStepIndex === totalSteps - 1;

  // Keyboard navigation support
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC to close
      if (event.key === "Escape") {
        event.preventDefault();
        skipTour();
        return;
      }

      // Arrow keys to navigate (only if dialog is open and not in an input)
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return; // Don't intercept if user is typing
      }

      if (event.key === "ArrowRight" && !isLastStep) {
        event.preventDefault();
        goToNextStep();
      } else if (event.key === "ArrowLeft" && safeStepIndex > 0) {
        event.preventDefault();
        goToPreviousStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    open,
    isLastStep,
    safeStepIndex,
    goToNextStep,
    goToPreviousStep,
    skipTour,
  ]);

  // Aria-live region for screen readers
  const ariaLiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && ariaLiveRef.current && currentStep) {
      // Announce step changes to screen readers
      ariaLiveRef.current.textContent = `Step ${safeStepIndex + 1} of ${totalSteps}: ${currentStep.title}. ${currentStep.description}`;
    }
  }, [open, safeStepIndex, totalSteps, currentStep]);

  // Loading state handling
  if (!ready) {
    return null;
  }

  const safeCurrentStep = steps[safeStepIndex];

  return (
    <>
      {/* Aria-live region for screen readers */}
      <div
        ref={ariaLiveRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md border-t-8"
          style={{ borderTopColor: accentColor }}
        >
          <DialogHeader className="space-y-3 text-left">
            <div
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide"
              style={{ color: accentColor }}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Quick Tour
            </div>
            <DialogTitle>
              {safeCurrentStep?.title ?? currentStep?.title ?? title}
            </DialogTitle>
            <DialogDescription>
              {safeCurrentStep?.description || currentStep?.description ? (
                <Fragment>
                  {safeCurrentStep?.description || currentStep?.description}
                  {(safeCurrentStep?.footnote || currentStep?.footnote) && (
                    <span className="mt-3 block text-xs text-muted-foreground/80">
                      {safeCurrentStep?.footnote || currentStep?.footnote}
                    </span>
                  )}
                </Fragment>
              ) : (
                subtitle ?? "Here's how this corner of Klutr works."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <span>
              Step {safeStepIndex + 1} of {totalSteps}
            </span>
            <div className="flex items-center gap-1" role="tablist" aria-label="Tour progress">
              {steps.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full transition",
                    index === safeStepIndex
                      ? "bg-foreground"
                      : "bg-muted"
                  )}
                  role="tab"
                  aria-selected={index === safeStepIndex}
                  aria-label={`Step ${index + 1}`}
                />
              ))}
            </div>
          </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={skipTour}
          >
            Skip tour
          </Button>
          {safeStepIndex > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToPreviousStep}
              aria-label="Go to previous step"
            >
              <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
              Back
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            className="ml-auto text-white shadow hover:opacity-90"
            style={{ backgroundColor: accentColor }}
            onClick={isLastStep ? finishTour : goToNextStep}
            aria-label={isLastStep ? "Finish tour" : "Go to next step"}
          >
            {isLastStep ? "Finish" : "Next"}
            {!isLastStep && (
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

