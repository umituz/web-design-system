
import type { Breakpoint, BreakpointValue } from '../../domain/types/breakpoint.types';

export const BREAKPOINTS: Record<Breakpoint, BreakpointValue> = {
  xs: { min: 0 },
  sm: { min: 640 },
  md: { min: 768 },
  lg: { min: 1024 },
  xl: { min: 1280 },
  '2xl': { min: 1536 },
};

export const createMediaQuery = (breakpoint: Breakpoint): string => {
  const bp = BREAKPOINTS[breakpoint];
  if (bp.max) {
    return `(min-width: ${bp.min}px) and (max-width: ${bp.max}px)`;
  }
  return `(min-width: ${bp.min}px)`;
};

export const createMaxMediaQuery = (breakpoint: Breakpoint): string => {
  const bp = BREAKPOINTS[breakpoint];
  const maxValue = bp.min - 1;
  return `(max-width: ${maxValue}px)`;
};

export const BREAKPOINT_ORDER: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

export const compareBreakpoints = (a: Breakpoint, b: Breakpoint): number => {
  const indexA = BREAKPOINT_ORDER.indexOf(a);
  const indexB = BREAKPOINT_ORDER.indexOf(b);
  return indexA - indexB;
};

export const isBreakpointGreaterThan = (a: Breakpoint, b: Breakpoint): boolean => {
  return compareBreakpoints(a, b) > 0;
};

export const isBreakpointLessThan = (a: Breakpoint, b: Breakpoint): boolean => {
  return compareBreakpoints(a, b) < 0;
};
