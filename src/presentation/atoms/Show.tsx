/**
 * Show Component (Atom)
 * @description Conditionally render content based on screen breakpoint
 */

import { useBreakpoint } from '../hooks/useMediaQuery';
import type { ShowProps } from '../../domain/types/breakpoint.types';
import type { BaseProps } from '../../domain/types';

export interface ShowComponentProps extends BaseProps, ShowProps {
  children: React.ReactNode;
}

/**
 * Conditionally show content based on breakpoint
 * @param above - Show on screens larger than this breakpoint
 * @param below - Show on screens smaller than this breakpoint
 * @param at - Show only on this specific breakpoint
 * @param children - Content to show
 *
 * @example
 * ```tsx
 * // Show on desktop (lg and above)
 * <Show above="lg"><DesktopNav /></Show>
 *
 * // Show on mobile (sm and below)
 * <Show below="md"><MobileNav /></Show>
 *
 * // Show only on tablet
 * <Show at="md"><TabletContent /></Show>
 * ```
 */
export const Show = ({ above, below, at, children, className }: ShowComponentProps) => {
  const { matches, isGreaterThan, isLessThan } = useBreakpoint();

  // Determine if content should be shown
  let shouldShow = true;

  if (above) {
    shouldShow = shouldShow && isGreaterThan(above);
  }

  if (below) {
    shouldShow = shouldShow && isLessThan(below);
  }

  if (at) {
    shouldShow = shouldShow && matches(at);
  }

  if (!shouldShow) {
    return null;
  }

  return <div className={className || ''}>{children}</div>;
};

Show.displayName = 'Show';
