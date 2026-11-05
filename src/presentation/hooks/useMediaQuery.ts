
import { useEffect, useState, useCallback, useRef, useMemo, useSyncExternalStore } from 'react';
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
import { TIMING } from '../../infrastructure/constants/timing.constants';

export function useMediaQuery(breakpoint: Breakpoint): boolean {
  const query = useMemo(() => createMediaQuery(breakpoint), [breakpoint]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined') return () => {};
      const media = window.matchMedia(query);
      media.addEventListener('change', onStoreChange);
      return () => media.removeEventListener('change', onStoreChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useBreakpoint(): UseBreakpointReturn {
  const sortedBreakpoints = useMemo(() => {
    return Object.entries(BREAKPOINTS).sort(
      ([, a], [, b]) => b.min - a.min
    );
  }, []);

  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'lg';

    const width = window.innerWidth;
    for (const [bp, value] of sortedBreakpoints) {
      if (width >= value.min) return bp as Breakpoint;
    }
    return 'xs';
  });

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

    updateBreakpoint();

    const handleResize = () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      resizeTimerRef.current = setTimeout(updateBreakpoint, TIMING.RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, [sortedBreakpoints]);

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
