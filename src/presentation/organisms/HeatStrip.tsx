import type { HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';

export interface HeatStripProps extends HTMLAttributes<HTMLSpanElement> {
  values: readonly number[];
  max?: number;
  ariaLabel?: string;
  cellSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

const cellSizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'size-2 rounded-[2px]',
  md: 'size-3 rounded-xs',
  lg: 'size-4 rounded-sm',
};

export function HeatStrip({
  values,
  max = 5,
  ariaLabel,
  cellSize = 'md',
  className,
  ...rest
}: HeatStripProps) {
  const safeMax = Math.max(max, 1);
  const label = ariaLabel ?? `Activity intensity: ${values.join(', ')}`;

  return (
    <span
      role="img"
      aria-label={label}
      className={cn('inline-flex items-center gap-1 shrink-0', className)}
      {...rest}
    >
      {values.map((val, index) => {
        const ratio = Math.min(Math.max(val / safeMax, 0), 1);
        let tone = 'bg-muted';
        if (ratio > 0 && ratio <= 0.33) {
          tone = 'bg-primary/30';
        } else if (ratio > 0.33 && ratio <= 0.66) {
          tone = 'bg-primary/60';
        } else if (ratio > 0.66 && ratio < 1) {
          tone = 'bg-primary/85';
        } else if (ratio >= 1) {
          tone = 'bg-primary';
        }

        return (
          <span
            key={index}
            className={cn('transition-colors', cellSizeStyles[cellSize], tone)}
          />
        );
      })}
    </span>
  );
}
