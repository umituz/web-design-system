/**
 * useDebounce Hook
 * @description Debounce a value with optimized performance
 */

import { useState, useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
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
  delay: number = 300
): T {
  const lastRun = useRef<Date>(new Date());
  const timeoutRef = useRef<number>();

  return useCallback((...args: Parameters<T>) => {
    const now = new Date();
    const timeSinceLastRun = now.getTime() - lastRun.current.getTime();

    if (timeSinceLastRun >= delay) {
      lastRun.current = now;
      return func(...args);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      lastRun.current = new Date();
      func(...args);
    }, delay - timeSinceLastRun);
  }, [func, delay]) as T;
}

import { useCallback } from 'react';
