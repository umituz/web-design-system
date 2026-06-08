/**
 * useDebounce Hook
 * @description Debounce a value with optimized performance
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { TIMING } from '../../infrastructure/constants/timing.constants';
import { clampToNonNegative } from '../../infrastructure/calculation/rangeClamper';

export function useDebounce<T>(value: T, delay: number = TIMING.DEBOUNCE_DEFAULT_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useThrottle Hook
 * @description Throttle a function to limit execution rate
 */
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number = TIMING.THROTTLE_DEFAULT_MS
): T {
  const lastRun = useRef<Date>(new Date());
  const timeoutRef = useRef<number | null>(null);

  return useCallback((...args: Parameters<T>) => {
    const now = new Date();
    const timeSinceLastRun = now.getTime() - lastRun.current.getTime();

    if (timeSinceLastRun >= delay) {
      lastRun.current = now;
      return func(...args);
    }

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    const delayUntilNextExecution = clampToNonNegative(delay - timeSinceLastRun);
    timeoutRef.current = window.setTimeout(() => {
      lastRun.current = new Date();
      func(...args);
    }, delayUntilNextExecution);
  }, [func, delay]) as T;
}
