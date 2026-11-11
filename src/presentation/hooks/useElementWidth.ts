import { useCallback, useLayoutEffect, useState } from 'react';

const FALLBACK_WIDTH = 640;

export interface UseElementWidthReturn {
  ref: (node: HTMLElement | null) => void;
  width: number;
}

export function useElementWidth(): UseElementWidthReturn {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState(FALLBACK_WIDTH);

  useLayoutEffect(() => {
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? 0;
      if (next > 0) setWidth(Math.round(next));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
    if (node) {
      const measured = node.getBoundingClientRect().width;
      if (measured > 0) setWidth(Math.round(measured));
    }
  }, []);

  return { ref, width };
}
