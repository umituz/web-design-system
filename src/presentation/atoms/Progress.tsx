/**
 * Progress Component (Atom)
 * @description Progress indicator bar
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import type { BaseProps } from '../../domain/types';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, size = 'md', ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={max}
        className={cn(
          'w-full bg-muted rounded-full overflow-hidden',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';
