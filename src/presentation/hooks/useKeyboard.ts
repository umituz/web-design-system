/**
 * useKeyboard Hook
 * @description Keyboard event handling
 */

import { useEffect } from 'react';

export type KeyboardKey = string;
export type KeyboardModifier = 'ctrl' | 'shift' | 'alt' | 'meta';

export interface KeyboardOptions {
  key: KeyboardKey;
  modifiers?: KeyboardModifier[];
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  enabled?: boolean;
}

export function useKeyboard({
  key,
  modifiers = [],
  onKeyDown,
  onKeyUp,
  enabled = true,
}: KeyboardOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      const modifiersMatch = modifiers.every((mod) => {
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

      if (keyMatches && modifiersMatch) {
        onKeyDown?.(event);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      const modifiersMatch = modifiers.every((mod) => {
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

      if (keyMatches && modifiersMatch) {
        onKeyUp?.(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [key, modifiers, onKeyDown, onKeyUp, enabled]);
}

export function useEscape(callback: () => void, enabled = true) {
  useKeyboard({
    key: 'Escape',
    onKeyDown: callback,
    enabled,
  });
}
