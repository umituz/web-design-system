/**
 * Divider Component (Atom)
 * @description Visual separator line
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface DividerProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

const orientationStyles = {
  horizontal: 'h-px w-full',
  vertical: 'h-full w-px',
};

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', decorative = true, role = 'separator', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={decorative ? 'none' : role}
        aria-orientation={orientation}
        className={cn('shrink-0 bg-border', orientationStyles[orientation], className)}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
