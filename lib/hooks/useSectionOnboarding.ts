"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import {
  hasSeenSectionOnboarding,
  markSectionOnboardingSeen,
  type SectionId,
} from "../onboarding";

export interface OnboardingStep {
  title: string;
  description: string;
  targetSelector?: string;
  targetRef?: RefObject<HTMLElement | null>;
  position: "top" | "bottom" | "left" | "right";
}

export interface UseSectionOnboardingOptions {
  section: SectionId;
  steps: OnboardingStep[];
  autoTrigger?: boolean;
  enabled?: boolean;
}

export function useSectionOnboarding({
  section,
  steps,
  autoTrigger = true,
  enabled = true,
}: UseSectionOnboardingOptions) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const hasSeen = hasSeenSectionOnboarding(section);
    if (autoTrigger && !hasSeen && steps.length > 0) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setActive(true);
        setStep(0);
        findTargetElement(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [section, autoTrigger, enabled, steps.length]);

  const findTargetElement = (stepIndex: number) => {
    const currentStep = steps[stepIndex];
    if (!currentStep) {
      setTargetElement(null);
      return;
    }

    if (currentStep.targetRef?.current) {
      setTargetElement(currentStep.targetRef.current);
      return;
    }

    if (currentStep.targetSelector) {
      const element = document.querySelector(
        currentStep.targetSelector
      ) as HTMLElement;
      setTargetElement(element || null);
      return;
    }

    setTargetElement(null);
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      const nextStepIndex = step + 1;
      setStep(nextStepIndex);
      findTargetElement(nextStepIndex);
    } else {
      endOnboarding();
    }
  };

  const startOnboarding = () => {
    setActive(true);
    setStep(0);
    findTargetElement(0);
  };

  const endOnboarding = () => {
    setActive(false);
    setStep(0);
    setTargetElement(null);
    markSectionOnboardingSeen(section);
  };

  const currentStep = active && steps[step] ? steps[step] : null;
  const isLastStep = step === steps.length - 1;

  return {
    active,
    step,
    currentStep,
    targetElement,
    isLastStep,
    nextStep,
    startOnboarding,
    endOnboarding,
  };
}
