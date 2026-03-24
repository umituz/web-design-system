/**
 * useMediaQuery & useBreakpoint Hooks
 * @description Enhanced responsive breakpoint detection with helper functions
 */

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import type {
  Breakpoint,
  UseBreakpointReturn,
} from '../../domain/types/breakpoint.types';
import {
  BREAKPOINTS,
  createMediaQuery,
  isBreakpointGreaterThan,
  isBreakpointLessThan,
} from '../../infrastructure/constants/breakpoint.constants';

/**
 * Simple media query hook for a single breakpoint
 * @param breakpoint - The breakpoint to check
 * @returns Whether the media query matches
 *
 * @example
 * ```tsx
 * const isDesktop = useMediaQuery('lg') // true on lg screens and above
 * ```
 */
export function useMediaQuery(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // FIX: SSR-safe check
    if (typeof window === 'undefined') return;

    const query = createMediaQuery(breakpoint);
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [breakpoint]);

  return matches;
}

/**
 * Enhanced breakpoint hook with helper functions
 * @returns Object containing current breakpoint and helper functions
 *
 * @example
 * ```tsx
 * const { currentBreakpoint, isMobile, isDesktop } = useBreakpoint()
 *
 * return (
 *   <div>
 *     {isMobile && <MobileNav />}
 *     {isDesktop && <DesktopNav />}
 *   </div>
 * )
 * ```
 */
export function useBreakpoint(): UseBreakpointReturn {
  // FIX: Sort breakpoints once and memoize
  const sortedBreakpoints = useMemo(() => {
    return Object.entries(BREAKPOINTS).sort(
      ([, a], [, b]) => b.min - a.min
    );
  }, []);

  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(() => {
    // FIX: SSR-safe initialization
    if (typeof window === 'undefined') return 'lg';

    const width = window.innerWidth;
    for (const [bp, value] of sortedBreakpoints) {
      if (width >= value.min) return bp as Breakpoint;
    }
    return 'xs';
  });

  // FIX: Use useRef for resize timer to prevent timer issues
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      for (const [bp, value] of sortedBreakpoints) {
        if (width >= value.min) {
          setCurrentBreakpoint(bp as Breakpoint);
          break;
        }
      }
    };

    // Initial check
    updateBreakpoint();

    // Debounced resize listener
    const handleResize = () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      resizeTimerRef.current = setTimeout(updateBreakpoint, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, [sortedBreakpoints]);

  // Helper functions
  const matches = useCallback(
    (breakpoint: Breakpoint | Breakpoint[]): boolean => {
      if (Array.isArray(breakpoint)) {
        return breakpoint.includes(currentBreakpoint);
      }
      return currentBreakpoint === breakpoint;
    },
    [currentBreakpoint]
  );

  const isGreaterThan = useCallback(
    (breakpoint: Breakpoint): boolean => {
      return isBreakpointGreaterThan(currentBreakpoint, breakpoint);
    },
    [currentBreakpoint]
  );

  const isLessThan = useCallback(
    (breakpoint: Breakpoint): boolean => {
      return isBreakpointLessThan(currentBreakpoint, breakpoint);
    },
    [currentBreakpoint]
  );

  // Computed values
  const isXs = currentBreakpoint === 'xs';
  const isSm = currentBreakpoint === 'sm';
  const isMd = currentBreakpoint === 'md';
  const isLg = currentBreakpoint === 'lg';
  const isXl = currentBreakpoint === 'xl';
  const is2Xl = currentBreakpoint === '2xl';

  const isMobile = isXs || isSm;
  const isTablet = isMd || isLg;
  const isDesktop = isXl || is2Xl;

  return {
    currentBreakpoint,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isMobile,
    isTablet,
    isDesktop,
    matches,
    isGreaterThan,
    isLessThan,
  };
}
