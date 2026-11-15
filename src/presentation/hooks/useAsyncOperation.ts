import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseAsyncOperationOptions<T, E> {
  readonly immediate?: boolean;
  readonly initialData?: T | null;
  readonly maxRetries?: number;
  readonly onSuccess?: (data: T) => void;
  readonly onError?: (error: E) => void;
  readonly onSettled?: () => void;
  readonly toError?: (error: unknown) => E;
}

export interface UseAsyncOperationReturn<T, A extends unknown[], E> {
  readonly data: T | null;
  readonly isLoading: boolean;
  readonly isIdle: boolean;
  readonly error: E | null;
  readonly execute: (...args: A) => Promise<T | null>;
  readonly reset: () => void;
}

const defaultToError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error));

export function useAsyncOperation<T, A extends unknown[] = [], E = Error>(
  operation: (...args: A) => Promise<T>,
  options: UseAsyncOperationOptions<T, E> = {}
): UseAsyncOperationReturn<T, A, E> {
  const {
    immediate = false,
    initialData = null,
    maxRetries = 0,
    onSuccess,
    onError,
    onSettled,
    toError = defaultToError as unknown as (error: unknown) => E,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [error, setError] = useState<E | null>(null);

  const mountedRef = useRef(true);
  const operationRef = useRef(operation);
  const optionsRef = useRef({ maxRetries, onSuccess, onError, onSettled, toError });

  useEffect(() => {
    operationRef.current = operation;
    optionsRef.current = { maxRetries, onSuccess, onError, onSettled, toError };
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: A): Promise<T | null> => {
    const { maxRetries: retries, onSuccess: success, onError: failure, onSettled: settled, toError: mapError } =
      optionsRef.current;
    const attempts = Math.max(0, retries) + 1;

    setIsLoading(true);
    setIsIdle(false);
    setError(null);

    let lastError: unknown;
    try {
      for (let attempt = 0; attempt < attempts; attempt++) {
        try {
          const result = await operationRef.current(...args);
          if (!mountedRef.current) return result;
          setData(result);
          setIsLoading(false);
          success?.(result);
          settled?.();
          return result;
        } catch (caught) {
          lastError = caught;
        }
      }
      throw lastError;
    } catch (caught) {
      const mapped = mapError(caught);
      if (mountedRef.current) {
        setError(mapped);
        setIsLoading(false);
      }
      failure?.(mapped);
      settled?.();
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setIsLoading(false);
    setIsIdle(true);
  }, [initialData]);

  useEffect(() => {
    if (!immediate) return;
    void Promise.resolve().then(() => (execute as () => Promise<T | null>)());
  }, [immediate, execute]);

  return { data, isLoading, isIdle, error, execute, reset };
}
