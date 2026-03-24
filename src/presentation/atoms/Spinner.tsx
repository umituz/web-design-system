/**
 * Spinner Component (Atom)
 * @description Loading indicator
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import type { RegularSizes } from '../../infrastructure/constants';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  size?: RegularSizes;
}

const sizeStyles: Record<RegularSizes, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
  xl: 'h-12 w-12 border-4',
};

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-spin rounded-full border-primary border-t-transparent',
          sizeStyles[size],
          className
        )}
        role="status"
        aria-label="Loading"
        {...props}
      />
    );
  }
);

Spinner.displayName = 'Spinner';
