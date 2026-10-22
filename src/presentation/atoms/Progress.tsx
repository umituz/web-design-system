/**
 * Progress Component (Atom)
 * @description Progress indicator bar with optional percent readout and
 *   threshold-driven auto tone (>=95 success, >=70 primary, below muted)
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import { percentOfMax } from '../../infrastructure/utils/calculation.utils';
import type { BaseProps } from '../../domain/types';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'auto';
  label?: string;
  /** Render the rounded percentage next to the bar. */
  showValue?: boolean;
}

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const toneStyles: Record<'primary' | 'success' | 'warning' | 'destructive' | 'info', string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
  info: 'bg-info',
};

const autoToneOf = (percentage: number) =>
  percentage >= 95 ? toneStyles.success : percentage >= 70 ? toneStyles.primary : 'bg-muted-foreground/45';

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, value = 0, max = 100, size = 'md', tone = 'primary', label, showValue = false, ...props },
    ref
  ) => {
    const percentage = percentOfMax(value, max);
    const fillTone = tone === 'auto' ? autoToneOf(percentage) : toneStyles[tone];
    const bar = (
      <div
        ref={ref}
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn('bg-muted rounded-full overflow-hidden', showValue ? 'min-w-0 flex-1' : 'w-full', sizeStyles[size], className)}
        {...props}
      >
        <div
          className={cn('h-full transition-all duration-300 ease-in-out', fillTone)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );

    if (!showValue) return bar;

    return (
      <div className="flex w-full items-center gap-2" role={label ? 'group' : undefined}>
        {bar}
        <span className="text-xs font-medium tabular-nums text-muted-foreground">{Math.round(percentage)}%</span>
      </div>
    );
  }
);

Progress.displayName = 'Progress';
