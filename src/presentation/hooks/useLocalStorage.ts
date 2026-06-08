/**
 * useLocalStorage Hook
 * @description LocalStorage state management with safe error surfacing
 */

import { useCallback, useState, useRef } from 'react';

const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readInitial = <T,>(key: string, initialValue: T): T => {
  if (!isBrowser()) return initialValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? initialValue : (JSON.parse(raw) as T);
  } catch (error) {
    console.error(`[useLocalStorage] Failed to read key "${key}":`, error);
    return initialValue;
  }
};

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => readInitial(key, initialValue));

  const valueRef = useRef(storedValue);
  valueRef.current = storedValue;

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      const next =
        typeof value === 'function' ? (value as (prev: T) => T)(valueRef.current) : value;

      setStoredValue(next);

      if (!isBrowser()) return;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch (error) {
        console.error(`[useLocalStorage] Failed to write key "${key}":`, error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`[useLocalStorage] Failed to remove key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
