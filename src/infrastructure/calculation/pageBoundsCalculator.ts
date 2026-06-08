/**
 * Page Bounds Calculator
 * @description Computes pagination bounds (total pages, displayed range, clamped page)
 */

import { clampToRange } from './rangeClamper';

export interface PageBounds {
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

export const computeTotalPages = (totalItems: number, pageSize: number): number => {
  if (pageSize <= 0) return 0;
  return Math.ceil(totalItems / pageSize);
};

export const clampPageNumber = (
  page: number,
  totalPages: number
): number => clampToRange(page, 1, Math.max(totalPages, 1));

export const computePageBounds = (
  currentPage: number,
  pageSize: number,
  totalItems: number
): PageBounds => {
  const totalPages = computeTotalPages(totalItems, pageSize);
  const safePage = clampPageNumber(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, totalItems);
  return { totalPages, startIndex, endIndex };
};
