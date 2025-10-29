import { useState, useCallback, useRef } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface AsyncActions<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
}

export function useAsyncState<T>(
  initialData: T | null = null
): [AsyncState<T>, AsyncActions<T>] {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const isMountedRef = useRef(true);

  const execute = useCallback(
    async (asyncFn: (...args: any[]) => Promise<T>, ...args: any[]) => {
      if (!isMountedRef.current) return null;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await asyncFn(...args);

        if (isMountedRef.current) {
          setState((prev) => ({ ...prev, data: result, loading: false }));
          return result;
        }

        return null;
      } catch (error) {
        if (isMountedRef.current) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          setState((prev) => ({
            ...prev,
            error: errorMessage,
            loading: false,
          }));
        }
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    if (isMountedRef.current) {
      setState({ data: initialData, loading: false, error: null });
    }
  }, [initialData]);

  const setData = useCallback((data: T | null) => {
    if (isMountedRef.current) {
      setState((prev) => ({ ...prev, data }));
    }
  }, []);

  const setError = useCallback((error: string | null) => {
    if (isMountedRef.current) {
      setState((prev) => ({ ...prev, error }));
    }
  }, []);

  // Cleanup on unmount
  useState(() => {
    return () => {
      isMountedRef.current = false;
    };
  });

  return [
    state,
    {
      execute,
      reset,
      setData,
      setError,
    },
  ];
}

// Hook for multiple async operations
export function useMultipleAsyncStates<T extends Record<string, any>>(
  initialState: Partial<T> = {}
): [
  T,
  (
    key: keyof T,
    asyncFn: (...args: any[]) => Promise<any>,
    ...args: any[]
  ) => Promise<any>
] {
  const [states, setStates] = useState<T>({} as T);
  const isMountedRef = useRef(true);

  const execute = useCallback(
    async (
      key: keyof T,
      asyncFn: (...args: any[]) => Promise<any>,
      ...args: any[]
    ) => {
      if (!isMountedRef.current) return null;

      setStates((prev) => ({
        ...prev,
        [key]: { ...prev[key], loading: true, error: null },
      }));

      try {
        const result = await asyncFn(...args);

        if (isMountedRef.current) {
          setStates((prev) => ({
            ...prev,
            [key]: { ...prev[key], data: result, loading: false },
          }));
          return result;
        }

        return null;
      } catch (error) {
        if (isMountedRef.current) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          setStates((prev) => ({
            ...prev,
            [key]: { ...prev[key], error: errorMessage, loading: false },
          }));
        }
        return null;
      }
    },
    []
  );

  // Cleanup on unmount
  useState(() => {
    return () => {
      isMountedRef.current = false;
    };
  });

  return [states, execute];
}

// Hook for optimistic updates
export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T, optimisticData: T) => T
) {
  const [data, setData] = useState<T>(initialData);
  const [optimisticData, setOptimisticData] = useState<T | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const update = useCallback(
    async (asyncUpdateFn: (currentData: T) => Promise<T>) => {
      setIsUpdating(true);

      // Apply optimistic update
      const newOptimisticData = updateFn(data, data);
      setOptimisticData(newOptimisticData);
      setData(newOptimisticData);

      try {
        const result = await asyncUpdateFn(data);
        setData(result);
        setOptimisticData(null);
        return result;
      } catch (error) {
        // Revert optimistic update on error
        setData(data);
        setOptimisticData(null);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [data, updateFn]
  );

  return {
    data: optimisticData || data,
    isUpdating,
    update,
    revert: () => {
      setOptimisticData(null);
      setIsUpdating(false);
    },
  };
}
