import { useEffect, useRef, useCallback } from "react";

// Hook for proper cleanup of async operations
export function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps?: React.DependencyList
) {
  const isMountedRef = useRef(true);
  const cleanupRef = useRef<(() => void) | void>();

  useEffect(() => {
    isMountedRef.current = true;
    
    const runEffect = async () => {
      try {
        const cleanup = await effect();
        if (isMountedRef.current) {
          cleanupRef.current = cleanup;
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error("Async effect error:", error);
        }
      }
    };

    runEffect();

    return () => {
      isMountedRef.current = false;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = undefined;
      }
    };
  }, deps);
}

// Hook for debounced async operations
export function useDebouncedAsync<T>(
  asyncFn: (value: T) => Promise<void>,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedFn = useCallback(
    (value: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        if (isMountedRef.current) {
          try {
            await asyncFn(value);
          } catch (error) {
            console.error("Debounced async operation error:", error);
          }
        }
      }, delay);
    },
    [asyncFn, delay]
  );

  return debouncedFn;
}

// Hook for cleanup of intervals
export function useInterval(
  callback: () => void,
  delay: number | null
) {
  const savedCallback = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      intervalRef.current = setInterval(() => {
        savedCallback.current();
      }, delay);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [delay]);
}

// Hook for cleanup of timeouts
export function useTimeout(
  callback: () => void,
  delay: number | null
) {
  const savedCallback = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      timeoutRef.current = setTimeout(() => {
        savedCallback.current();
      }, delay);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [delay]);
}

// Hook for cleanup of event listeners
export function useEventListener<T extends keyof WindowEventMap>(
  eventName: T,
  handler: (event: WindowEventMap[T]) => void,
  element?: Element | Window | null
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement = element || window;
    
    if (!targetElement?.addEventListener) {
      return;
    }

    const eventListener = (event: Event) => {
      savedHandler.current(event as WindowEventMap[T]);
    };

    targetElement.addEventListener(eventName, eventListener);

    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}

// Hook for cleanup of AbortController
export function useAbortController() {
  const abortControllerRef = useRef<AbortController>();

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return abortControllerRef.current;
}

// Hook for cleanup of fetch requests
export function useFetchWithCleanup() {
  const abortControllerRef = useRef<AbortController>();

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchWithCleanup = useCallback(
    async (url: string, options?: RequestInit) => {
      if (!abortControllerRef.current) {
        throw new Error("Component unmounted");
      }

      return fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal,
      });
    },
    []
  );

  return fetchWithCleanup;
}
