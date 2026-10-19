/**
 * StatPill Component (Molecule)
 * @description Compact inline stat — bold value over a muted label, for
 *   dense rows and summary strips where a stat card is too heavy.
 */

import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';

export type StatPillTone = 'default' | 'success' | 'warning' | 'destructive' | 'info';

export interface StatPillProps {
  label: string;
  value: ReactNode;
  tone?: StatPillTone;
  className?: string;
}

const toneStyles: Record<StatPillTone, string> = {
  default: 'text-foreground',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
  info: 'text-info',
};

export const StatPill = forwardRef<HTMLSpanElement, StatPillProps>(
  ({ className, label, value, tone = 'default' }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex flex-col rounded-md border border-border bg-muted/40 px-2.5 py-1.5 leading-tight',
        className
      )}
    >
      <span className={cn('text-sm font-semibold tabular-nums', toneStyles[tone])}>{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </span>
  )
);
StatPill.displayName = 'StatPill';
