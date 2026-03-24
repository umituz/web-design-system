/**
 * Responsive System Constants
 * @description Centralized breakpoint values matching Tailwind CSS defaults
 */

import type { Breakpoint, BreakpointValue } from '../../domain/types/breakpoint.types';

/**
 * Breakpoint values matching Tailwind CSS default breakpoints
 * https://tailwindcss.com/docs/screens
 */
export const BREAKPOINTS: Record<Breakpoint, BreakpointValue> = {
  xs: { min: 0 },
  sm: { min: 640 },
  md: { min: 768 },
  lg: { min: 1024 },
  xl: { min: 1280 },
  '2xl': { min: 1536 },
};

/**
 * Create a media query string for a given breakpoint
 * @param breakpoint - The breakpoint to create a query for
 * @returns CSS media query string (e.g., "(min-width: 640px)")
 */
export const createMediaQuery = (breakpoint: Breakpoint): string => {
  const bp = BREAKPOINTS[breakpoint];
  if (bp.max) {
    return `(min-width: ${bp.min}px) and (max-width: ${bp.max}px)`;
  }
  return `(min-width: ${bp.min}px)`;
};

/**
 * Create a max-width media query
 * @param breakpoint - The breakpoint to create a max query for
 * @returns CSS media query string (e.g., "(max-width: 639px)")
 */
export const createMaxMediaQuery = (breakpoint: Breakpoint): string => {
  const bp = BREAKPOINTS[breakpoint];
  const maxValue = bp.min - 1;
  return `(max-width: ${maxValue}px)`;
};

/**
 * Breakpoint order for comparison operations
 */
export const BREAKPOINT_ORDER: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

/**
 * Compare two breakpoints
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 */
export const compareBreakpoints = (a: Breakpoint, b: Breakpoint): number => {
  const indexA = BREAKPOINT_ORDER.indexOf(a);
  const indexB = BREAKPOINT_ORDER.indexOf(b);
  return indexA - indexB;
};

/**
 * Check if breakpoint A is greater than breakpoint B
 */
export const isBreakpointGreaterThan = (a: Breakpoint, b: Breakpoint): boolean => {
  return compareBreakpoints(a, b) > 0;
};

/**
 * Check if breakpoint A is less than breakpoint B
 */
export const isBreakpointLessThan = (a: Breakpoint, b: Breakpoint): boolean => {
  return compareBreakpoints(a, b) < 0;
};
