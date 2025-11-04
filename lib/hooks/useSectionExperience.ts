"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface TourStep {
  id: string;
  title: string;
  description: string;
  footnote?: string;
}

export interface StartTourOptions {
  restart?: boolean;
}

const SUMMARY_KEY_PREFIX = "klutr.section.summary.";
const TOUR_KEY_PREFIX = "klutr.section.tour.";

const getStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch (error) {
    console.warn("[klutr] Unable to access localStorage", error);
    return null;
  }
};

export function useSectionSummary(sectionId: string, defaultExpanded = true) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storage = getStorage();
    if (storage) {
      const stored = storage.getItem(SUMMARY_KEY_PREFIX + sectionId);
      if (stored !== null) {
        setExpanded(stored === "1");
      }
    }
    setReady(true);
  }, [sectionId]);

  // Debounce localStorage writes to prevent performance issues
  const writeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setAndPersist = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setExpanded((prev) => {
        const next =
          typeof value === "function"
            ? (value as (prev: boolean) => boolean)(prev)
            : value;

        // Clear any pending writes
        if (writeTimeoutRef.current) {
          clearTimeout(writeTimeoutRef.current);
        }

        // Debounce localStorage write
        writeTimeoutRef.current = setTimeout(() => {
          try {
            const storage = getStorage();
            if (storage) {
              storage.setItem(SUMMARY_KEY_PREFIX + sectionId, next ? "1" : "0");
            }
          } catch (error) {
            // Fallback: silently continue if localStorage fails
            console.warn("[klutr] Failed to persist summary state:", error);
          }
        }, 100); // 100ms debounce

        return next;
      });
    },
    [sectionId]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (writeTimeoutRef.current) {
        clearTimeout(writeTimeoutRef.current);
      }
    };
  }, []);

  const toggle = useCallback(
    () => setAndPersist((prev) => !prev),
    [setAndPersist]
  );

  return {
    expanded,
    ready,
    toggle,
    setExpanded: setAndPersist,
  };
}

interface SectionTourOptions {
  autoStart?: boolean;
}

export function useSectionTour(
  sectionId: string,
  steps: TourStep[],
  options?: SectionTourOptions
) {
  const [open, setOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [ready, setReady] = useState(false);

  const key = useMemo(() => TOUR_KEY_PREFIX + sectionId, [sectionId]);

  useEffect(() => {
    try {
      const storage = getStorage();
      const seen = storage?.getItem(key) === "1";
      setCompleted(seen);
      if (!seen && steps.length > 0 && options?.autoStart !== false) {
        setCurrentStepIndex(0);
        setOpen(true);
      }
    } catch (error) {
      // Fallback: if localStorage fails, assume tour hasn't been seen
      console.warn("[klutr] Failed to check tour completion state:", error);
      setCompleted(false);
      if (steps.length > 0 && options?.autoStart !== false) {
        setCurrentStepIndex(0);
        setOpen(true);
      }
    } finally {
      setReady(true);
    }
  }, [key, steps, options?.autoStart]);

  const markSeen = useCallback(() => {
    try {
      const storage = getStorage();
      if (storage) {
        storage.setItem(key, "1");
      }
      setCompleted(true);
    } catch (error) {
      // Fallback: silently continue if localStorage fails (e.g., private browsing)
      console.warn("[klutr] Failed to mark tour as seen:", error);
      setCompleted(true);
    }
  }, [key]);

  const resetSeen = useCallback(() => {
    try {
      const storage = getStorage();
      if (storage) {
        storage.removeItem(key);
      }
      setCompleted(false);
    } catch (error) {
      // Fallback: continue even if localStorage fails
      console.warn("[klutr] Failed to reset tour seen state:", error);
      setCompleted(false);
    }
  }, [key]);

  const startTour = useCallback(
    (startOptions?: StartTourOptions) => {
      if (startOptions?.restart) {
        resetSeen();
      }
      setCurrentStepIndex(0);
      setOpen(true);
    },
    [resetSeen]
  );

  const finishTour = useCallback(() => {
    markSeen();
    setOpen(false);
  }, [markSeen]);

  const skipTour = useCallback(() => {
    markSeen();
    setOpen(false);
  }, [markSeen]);

  const goToNextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const next = prev + 1;
      if (next >= steps.length) {
        finishTour();
        return prev;
      }
      return next;
    });
  }, [steps.length, finishTour]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const currentStep = steps[currentStepIndex];

  return {
    ready,
    open,
    setOpen,
    steps,
    currentStepIndex,
    currentStep,
    totalSteps: steps.length,
    completed,
    startTour,
    finishTour,
    skipTour,
    goToNextStep,
    goToPreviousStep,
    resetSeen,
  };
}

