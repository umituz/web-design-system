
import { useBreakpoint } from '../hooks/useMediaQuery';
import type { ShowProps } from '../../domain/types/breakpoint.types';
import type { BaseProps } from '../../domain/types';

export interface ShowComponentProps extends BaseProps, ShowProps {
  children: React.ReactNode;
}

export const Show = ({ above, below, at, children, className }: ShowComponentProps) => {
  const { matches, isGreaterThan, isLessThan } = useBreakpoint();

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
