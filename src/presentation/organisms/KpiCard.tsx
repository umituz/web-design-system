/**
 * KpiCard Component (Organism)
 * @description Compact key-metric card: label, value, delta badge, hint and sparkline
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import { Card, CardContent } from './Card';
import { Sparkline } from '../atoms/Sparkline';

export type KpiIconTone = 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'muted' | 'violet';

export interface KpiDelta {
  value: ReactNode;
  direction?: 'up' | 'down';
  good?: boolean;
}

export interface KpiCardProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  label: ReactNode;
  value: ReactNode;
  delta?: KpiDelta;
  hint?: ReactNode;
  icon?: ReactNode;
  iconTone?: KpiIconTone;
  spark?: readonly number[];
  sparkTone?: KpiIconTone;
  /** Danger emphasis for metrics that need attention, e.g. open incidents. */
  alert?: boolean;
  onClick?: () => void;
}

const toneTextClasses: Record<KpiIconTone, string> = {
  primary: 'text-primary bg-primary/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  destructive: 'text-destructive bg-destructive/10',
  info: 'text-info bg-info/10',
  muted: 'text-muted-foreground bg-muted',
  violet: 'text-violet-600 bg-violet-500/10',
};

export const KpiCard = forwardRef<HTMLDivElement, KpiCardProps>(
  ({ className, label, value, delta, hint, icon, iconTone = 'primary', spark, sparkTone = 'primary', alert, onClick, ...props }, ref) => {
    const deltaDirection = delta?.direction ?? (delta?.good === false ? 'down' : 'up');
    const deltaGood = delta?.good ?? deltaDirection === 'up';
    const DeltaIcon = deltaDirection === 'up' ? TrendingUp : TrendingDown;
    const interactive = onClick !== undefined;
    return (
      <Card
        ref={ref}
        className={cn(
          className,
          alert && 'border-destructive/45 bg-destructive/5',
          interactive && 'cursor-pointer transition-colors hover:border-primary/40'
        )}
        onClick={onClick}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
        {...props}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-semibold leading-none tracking-tight">{value}</p>
            </div>
            {icon !== undefined && (
              <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4', toneTextClasses[iconTone])}>
                {icon}
              </span>
            )}
          </div>
          {(delta !== undefined || hint !== undefined || spark !== undefined) && (
            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="flex min-w-0 items-center gap-1.5 text-xs">
                {delta !== undefined && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 font-medium',
                      deltaGood ? 'text-success' : 'text-destructive'
                    )}
                  >
                    <DeltaIcon className="h-3.5 w-3.5" />
                    {delta.value}
                  </span>
                )}
                {hint !== undefined && <span className="truncate text-muted-foreground">{hint}</span>}
              </div>
              {spark !== undefined && spark.length > 1 && (
                <Sparkline data={spark} tone={sparkTone} className="shrink-0" />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

KpiCard.displayName = 'KpiCard';
