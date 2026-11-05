
import { useBreakpoint } from '../hooks/useMediaQuery';
import type { HideProps } from '../../domain/types/breakpoint.types';
import type { BaseProps } from '../../domain/types';

export interface HideComponentProps extends BaseProps, HideProps {
  children: React.ReactNode;
}

export const Hide = ({ above, below, at, children, className }: HideComponentProps) => {
  const { matches, isGreaterThan, isLessThan } = useBreakpoint();

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
