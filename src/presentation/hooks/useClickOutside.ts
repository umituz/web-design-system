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

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: Event) => {
      // FIX: Safe null check and type guard
      const target = event.target as Node;
      if (ref.current && target && !ref.current.contains(target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [callback, enabled]);

  return ref;
}
