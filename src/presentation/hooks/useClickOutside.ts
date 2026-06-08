/**
 * useClickOutside Hook
 * @description Detect clicks outside an element
 */

import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  enabled: boolean = true
) {
  const ref = useRef<T>(null);
  // Use a ref to keep the latest callback without retriggering the effect
  // on every render — callers commonly pass inline functions.
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (ref.current && !ref.current.contains(target)) {
        callbackRef.current();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [enabled]);

  return ref;
}
