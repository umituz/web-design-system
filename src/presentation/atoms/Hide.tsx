/**
 * Hide Component (Atom)
 * @description Conditionally hide content based on screen breakpoint
 */

import { useBreakpoint } from '../hooks/useMediaQuery';
import type { Breakpoint, HideProps } from '../../domain/types/breakpoint.types';
import type { BaseProps } from '../../domain/types';

export interface HideComponentProps extends BaseProps, HideProps {
  children: React.ReactNode;
}

/**
 * Conditionally hide content based on breakpoint
 * @param above - Hide on screens larger than this breakpoint
 * @param below - Hide on screens smaller than this breakpoint
 * @param at - Hide only on this specific breakpoint
 * @param children - Content to hide
 *
 * @example
 * ```tsx
 * // Hide on mobile (md and below)
 * <Hide below="md"><DesktopNav /></Hide>
 *
 * // Hide on desktop (lg and above)
 * <Hide above="lg"><MobileNav /></Hide>
 *
 * // Hide only on tablet
 * <Hide at="md"><TabletContent /></Hide>
 * ```
 */
export const Hide = ({ above, below, at, children, className }: HideComponentProps) => {
  const { matches, isGreaterThan, isLessThan } = useBreakpoint();

  // Determine if content should be hidden
  let shouldHide = false;

  if (above) {
    shouldHide = shouldHide || isGreaterThan(above);
  }

  if (below) {
    shouldHide = shouldHide || isLessThan(below);
  }

  if (at) {
    shouldHide = shouldHide || matches(at);
  }

  if (shouldHide) {
    return null;
  }

  return <div className={className || ''}>{children}</div>;
};

Hide.displayName = 'Hide';
