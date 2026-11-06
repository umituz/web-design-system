import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface SectionHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
    BaseProps {
  kicker?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ kicker, title, subtitle, description, actions, className, ...props }, ref) => {
    const desc = subtitle ?? description;
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-start justify-between gap-3 mb-3.5',
          className
        )}
        {...props}
      >
        <div className="min-w-0">
          {kicker && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {kicker}
            </p>
          )}
          {title && (
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {desc && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
              {desc}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';
