/**
 * useKeyboard Hook
 * @description Keyboard event handling
 */

import { useEffect, useCallback } from 'react';

export type KeyboardKey = string;
export type KeyboardModifier = 'ctrl' | 'shift' | 'alt' | 'meta';

export interface KeyboardOptions {
  key: KeyboardKey;
  modifiers?: KeyboardModifier[];
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  enabled?: boolean;
}

// Helper function to check if modifiers match
const checkModifiers = (event: KeyboardEvent, modifiers: KeyboardModifier[]): boolean => {
  return modifiers.every((mod) => {
    switch (mod) {
      case 'ctrl':
        return event.ctrlKey;
      case 'shift':
        return event.shiftKey;
      case 'alt':
        return event.altKey;
      case 'meta':
        return event.metaKey;
      default:
        return true;
    }
  });
};

export function useKeyboard({
  key,
  modifiers = [],
  onKeyDown,
  onKeyUp,
  enabled = true,
}: KeyboardOptions) {
  // FIX: Create handlers once and reuse to prevent duplicate logic
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const keyMatches = event.key.toLowerCase() === key.toLowerCase();
    const modifiersMatch = checkModifiers(event, modifiers);

    if (keyMatches && modifiersMatch) {
      onKeyDown?.(event);
    }
  }, [key, modifiers, onKeyDown]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const keyMatches = event.key.toLowerCase() === key.toLowerCase();
    const modifiersMatch = checkModifiers(event, modifiers);

    if (keyMatches && modifiersMatch) {
      onKeyUp?.(event);
    }
  }, [key, modifiers, onKeyUp]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, handleKeyDown, handleKeyUp]);
}

export function useEscape(callback: () => void, enabled = true) {
  useKeyboard({
    key: 'Escape',
    onKeyDown: callback,
    enabled,
  });
}
