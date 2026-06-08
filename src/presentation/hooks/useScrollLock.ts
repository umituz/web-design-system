/**
 * useScrollLock Hook
 * @description Lock/unlock body scroll while preserving scrollbar gutter
 */

import { useEffect } from 'react';
import { measureScrollbarWidth } from '../../infrastructure/calculation/scrollbarWidthMeasurer';

const SCROLLBAR_GUTTER_STYLE_ID = 'use-scroll-lock-gutter-style';

const ensureScrollbarGutterStyle = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(SCROLLBAR_GUTTER_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = SCROLLBAR_GUTTER_STYLE_ID;
  style.textContent = `
    html.use-scroll-lock-active body {
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
};

export const useScrollLock = (enabled: boolean = true): void => {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    ensureScrollbarGutterStyle();
    const html = document.documentElement;
    const body = document.body;

    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = measureScrollbarWidth();

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
    html.classList.add('use-scroll-lock-active');

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      html.classList.remove('use-scroll-lock-active');
    };
  }, [enabled]);
};
