import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export type InsightTone = 'positive' | 'attention' | 'neutral' | 'danger' | 'primary';
export type InsightVariant = 'minimal' | 'callout';

export interface InsightItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, BaseProps {
  title: ReactNode;
  description?: ReactNode;
  tone?: InsightTone;
  variant?: InsightVariant;
  icon?: ReactNode;
}

const minimalDotStyles: Record<InsightTone, string> = {
  positive: 'bg-emerald-500',
  attention: 'bg-amber-500',
  neutral: 'bg-muted-foreground/60',
  danger: 'bg-destructive',
  primary: 'bg-primary',
};

const calloutBoxStyles: Record<InsightTone, string> = {
  positive: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100',
  attention: 'border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100',
  neutral: 'border-border bg-muted/40 text-muted-foreground',
  danger: 'border-destructive/30 bg-destructive/10 text-destructive',
  primary: 'border-primary/30 bg-primary/10 text-primary',
};

export const InsightItem = forwardRef<HTMLDivElement, InsightItemProps>(
  (
    {
      className,
      title,
      description,
      tone = 'primary',
      variant = 'minimal',
      icon,
      ...props
    },
    ref
  ) => {
    if (variant === 'callout') {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-left',
            calloutBoxStyles[tone],
            className
          )}
          {...props}
        >
          {icon && <span className="mt-0.5 shrink-0" aria-hidden="true">{icon}</span>}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight text-foreground">{title}</p>
            {description && <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-start gap-2.5 text-left', className)}
        {...props}
      >
        {icon ? (
          <span className="mt-0.5 shrink-0" aria-hidden="true">{icon}</span>
        ) : (
          <span
            className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', minimalDotStyles[tone])}
            aria-hidden="true"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight text-foreground">{title}</p>
          {description && <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>}
        </div>
      </div>
    );
  }
);

InsightItem.displayName = 'InsightItem';
