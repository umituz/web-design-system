import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import { percentOfMax } from '../../infrastructure/utils/calculation.utils';
import type { BaseProps } from '../../domain/types';

export interface ProgressRingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    BaseProps {
  value?: number;
  max?: number;
  size?: number;
  stroke?: number;
  tone?: 'primary' | 'success' | 'warning' | 'destructive' | 'info';
  label?: string;
  showValue?: boolean;
}

const ringToneStyles: Record<NonNullable<ProgressRingProps['tone']>, string> = {
  primary: 'stroke-primary',
  success: 'stroke-success',
  warning: 'stroke-warning',
  destructive: 'stroke-destructive',
  info: 'stroke-info',
};

export const ProgressRing = forwardRef<HTMLDivElement, ProgressRingProps>(
  (
    { className, value = 0, max = 100, size = 96, stroke = 7, tone = 'primary', label, showValue = true, ...props },
    ref
  ) => {
    const percentage = Math.max(0, Math.min(100, percentOfMax(value, max)));
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const filled = (percentage / 100) * circumference;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('relative inline-flex items-center justify-center', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg width={size} height={size} aria-hidden className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-muted" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference - filled}`}
            className={cn('transition-all duration-300 ease-in-out', ringToneStyles[tone])}
          />
        </svg>
        {showValue && (
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);

ProgressRing.displayName = 'ProgressRing';
