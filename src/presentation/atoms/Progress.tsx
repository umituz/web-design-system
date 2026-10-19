/**
 * Progress Component (Atom)
 * @description Progress indicator bar
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import { percentOfMax } from '../../infrastructure/utils/calculation.utils';
import type { BaseProps } from '../../domain/types';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'primary' | 'success' | 'warning' | 'destructive';
  label?: string;
}

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const toneStyles: Record<'primary' | 'success' | 'warning' | 'destructive', string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, size = 'md', tone = 'primary', label, ...props }, ref) => {
    const percentage = percentOfMax(value, max);

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          'w-full bg-muted rounded-full overflow-hidden',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <div
          className={cn('h-full transition-all duration-300 ease-in-out', toneStyles[tone])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';
