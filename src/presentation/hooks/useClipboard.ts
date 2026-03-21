/**
 * useClipboard Hook
 * @description Clipboard operations
 */

import { useState, useCallback } from 'react';

export interface UseClipboardReturn {
  value: string;
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

export function useClipboard(): UseClipboardReturn {
  const [value, setValue] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setValue(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopied(false);
    }
  }, []);

  return {
    value,
    copied,
    copy,
  };
}
