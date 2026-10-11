/**
 * Calculation Utils
 * @description Small numeric helpers used by presentation components
 * (progress percentage, pagination bounds, trend formatting, clamping)
 */

// --- Clamping ---

export const clampToRange = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) return min;
  if (min > max) [min, max] = [max, min];
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const clampToNonNegative = (value: number): number =>
  value < 0 || Number.isNaN(value) ? 0 : value;

export const clampToPositive = (value: number, fallback: number = 1): number =>
  value <= 0 || Number.isNaN(value) ? fallback : value;

// --- Percentage ---

const PERCENT_MIN = 0;
const PERCENT_MAX = 100;

export const percentOfMax = (value: number, max: number): number => {
  if (max <= 0) return PERCENT_MIN;
  return clampToRange((value / max) * PERCENT_MAX, PERCENT_MIN, PERCENT_MAX);
};

// --- Trend formatting ---

const PERCENT_FRACTION_DIGITS = 1;
const SIGN_THRESHOLD = 0;
const POSITIVE_SIGN = '+';
const NEGATIVE_SIGN = '-';

export const formatTrendMagnitude = (value: number, fractionDigits: number = PERCENT_FRACTION_DIGITS): string => {
  if (Number.isNaN(value)) return '0%';
  const sign = value > SIGN_THRESHOLD ? POSITIVE_SIGN : value < SIGN_THRESHOLD ? NEGATIVE_SIGN : '';
  return `${sign}${Math.abs(value).toFixed(fractionDigits)}%`;
};

// --- Pagination bounds ---

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
