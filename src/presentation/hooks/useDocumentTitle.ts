import { useEffect } from 'react';

export interface DocumentTitleOptions {
  suffix?: string;
  fallback?: string;
}

export function useDocumentTitle(title?: string, options: DocumentTitleOptions = {}): void {
  const { suffix = '', fallback = '' } = options;
  useEffect(() => {
    document.title = title ? (suffix ? `${title} ${suffix}` : title) : fallback;
    return () => {
      document.title = fallback;
    };
  }, [title, suffix, fallback]);
}
