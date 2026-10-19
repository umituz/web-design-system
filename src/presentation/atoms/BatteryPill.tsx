/**
 * BatteryPill Component (Atom)
 * @description Battery charge indicator: outline cell with fill level and percentage
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface BatteryPillProps extends HTMLAttributes<HTMLSpanElement>, BaseProps {
  /** Charge percentage, clamped to 0-100. */
  pct: number;
}

export const BatteryPill = forwardRef<HTMLSpanElement, BatteryPillProps>(
  ({ pct, className, title, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, pct));
    const tone = clamped <= 20 ? 'text-destructive' : clamped <= 40 ? 'text-warning' : 'text-success';
    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center gap-1.5 text-xs font-medium', tone, className)}
        title={title ?? `Battery ${clamped}%`}
        {...props}
      >
        <span aria-hidden="true" className="relative inline-flex h-3 w-6 items-center rounded-[2px] border border-current p-[2px]">
          <span className="block h-full rounded-[1px] bg-current" style={{ width: `${clamped}%` }} />
          <span className="absolute -right-[3px] top-1/2 h-1.5 w-[2px] -translate-y-1/2 rounded-r-sm bg-current" />
        </span>
        {clamped}%
      </span>
    );
  }
);

BatteryPill.displayName = 'BatteryPill';
