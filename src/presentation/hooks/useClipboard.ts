/**
 * useClipboard Hook
 * @description Clipboard operations with proper cleanup
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { TIMING } from '../../infrastructure/constants/timing.constants';

export interface UseClipboardReturn {
  value: string;
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
}

export function useClipboard(): UseClipboardReturn {
  const [value, setValue] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      console.error('[useClipboard] Clipboard API is not available in this environment.');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setValue(text);
      setCopied(true);

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, TIMING.CLIPBOARD_RESET_MS);

      return true;
    } catch (error) {
      console.error('[useClipboard] Failed to copy text:', error);
      setCopied(false);
      return false;
    }
  }, []);

  return { value, copied, copy };
}
