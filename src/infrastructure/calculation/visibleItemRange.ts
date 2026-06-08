/**
 * Visible Item Range
 * @description Calculates the [start, end] index range of items visible in a scrollable viewport
 */

import { clampToNonNegative, clampToRange } from './rangeClamper';

export interface VisibleRangeInput {
  scrollTop: number;
  itemHeight: number;
  containerHeight: number;
  totalItems: number;
  overscan?: number;
}

export interface VisibleRange {
  startIndex: number;
  endIndex: number;
}

const DEFAULT_OVERSCAN = 5;

export const computeVisibleItemRange = ({
  scrollTop,
  itemHeight,
  containerHeight,
  totalItems,
  overscan = DEFAULT_OVERSCAN,
}: VisibleRangeInput): VisibleRange => {
  if (totalItems <= 0 || itemHeight <= 0 || containerHeight <= 0) {
    return { startIndex: 0, endIndex: 0 };
  }

  const safeScrollTop = clampToNonNegative(scrollTop);
  const safeOverscan = clampToNonNegative(overscan);
  const lastIndex = totalItems - 1;

  const rawStart = Math.floor(safeScrollTop / itemHeight) - safeOverscan;
  const startIndex = clampToRange(rawStart, 0, lastIndex);

  const rawEnd = Math.ceil((safeScrollTop + containerHeight) / itemHeight) + safeOverscan;
  const endIndex = clampToRange(rawEnd, startIndex, lastIndex);

  return { startIndex, endIndex };
};

export const totalScrollHeight = (totalItems: number, itemHeight: number): number => {
  if (itemHeight <= 0) return 0;
  return totalItems * itemHeight;
};
