/**
 * Scrollbar Width Measurer
 * @description Returns the width of the vertical scrollbar to prevent layout shift when locking body scroll
 */

import { clampToNonNegative } from './rangeClamper';

const SERVER_FALLBACK_WIDTH = 0;

export const measureScrollbarWidth = (): number => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return SERVER_FALLBACK_WIDTH;
  }
  const width = window.innerWidth - document.documentElement.clientWidth;
  return clampToNonNegative(width);
};
