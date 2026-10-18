/**
 * Sparkline Component (Atom)
 * @description Minimal inline line chart for compact trends
 */

import { forwardRef, type SVGAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, 'data'>, BaseProps {
  data: readonly number[];
  width?: number;
  height?: number;
  tone?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info' | 'muted';
}

const toneClasses: Record<NonNullable<SparklineProps['tone']>, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary-foreground',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
  info: 'text-info',
  muted: 'text-muted-foreground',
};

export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(
  ({ className, data, width = 96, height = 28, tone = 'primary', ...props }, ref) => {
    const points = data.filter((value) => Number.isFinite(value));
    const path = (() => {
      if (points.length < 2) return '';
      const min = Math.min(...points);
      const max = Math.max(...points);
      const span = max - min || 1;
      return points
        .map((value, index) => {
          const x = (index / (points.length - 1)) * width;
          const y = height - ((value - min) / span) * height;
          return `${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(' ');
    })();
    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        fill="none"
        aria-hidden="true"
        className={cn(toneClasses[tone], className)}
        {...props}
      >
        {path && <polyline points={path} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    );
  }
);

Sparkline.displayName = 'Sparkline';
