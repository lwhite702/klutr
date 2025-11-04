"use client";

import { Fragment } from "react";
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
  const {
    open,
    setOpen,
    steps,
    currentStep,
    currentStepIndex,
    totalSteps,
    goToNextStep,
    goToPreviousStep,
    skipTour,
    finishTour,
  } = tour;

  if (!steps.length) {
    return null;
  }

  const accentColor = accentMap[accent];
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
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
          <DialogTitle>{currentStep?.title ?? title}</DialogTitle>
          <DialogDescription>
            {currentStep?.description ? (
              <Fragment>
                {currentStep.description}
                {currentStep.footnote && (
                  <span className="mt-3 block text-xs text-muted-foreground/80">
                    {currentStep.footnote}
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
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <div className="flex items-center gap-1">
            {steps.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition",
                  index === currentStepIndex
                    ? "bg-foreground"
                    : "bg-muted"
                )}
                aria-hidden="true"
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
          {currentStepIndex > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToPreviousStep}
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
          >
            {isLastStep ? "Finish" : "Next"}
            {!isLastStep && (
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

