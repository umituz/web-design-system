import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Flame } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export type StreakBadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface StreakBadgeProps extends HTMLAttributes<HTMLSpanElement>, BaseProps {
  days?: number;
  count?: number;
  active?: boolean;
  size?: StreakBadgeSize;
  showIcon?: boolean;
  icon?: ReactNode;
  label?: ReactNode;
}

const sizeStyles: Record<StreakBadgeSize, string> = {
  xs: 'h-5 px-1.5 text-[11px] gap-1 [&_svg]:size-2.5',
  sm: 'h-6 px-2 text-xs gap-1.5 [&_svg]:size-3',
  md: 'h-7 px-2.5 text-sm gap-1.5 [&_svg]:size-3.5',
  lg: 'h-8 px-3 text-base gap-2 [&_svg]:size-4',
};

export const StreakBadge = forwardRef<HTMLSpanElement, StreakBadgeProps>(
  (
    {
      className,
      days,
      count,
      active,
      size = 'md',
      showIcon = true,
      icon,
      label,
      children,
      title,
      ...props
    },
    ref
  ) => {
    const resolvedDays = days ?? count ?? 0;
    const isActive = active !== undefined ? active : resolvedDays > 0;
    const defaultTitle = title ?? (resolvedDays > 0 ? `${resolvedDays} day streak` : 'No streak');

    return (
      <span
        ref={ref}
        title={defaultTitle}
        className={cn(
          'inline-flex items-center rounded-full border font-semibold tracking-tight transition-colors',
          isActive
            ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
            : 'border-border bg-muted/50 text-muted-foreground',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {showIcon && (
          <span
            aria-hidden="true"
            className={cn(
              'inline-flex items-center shrink-0',
              isActive ? 'text-amber-500' : 'text-muted-foreground'
            )}
          >
            {icon ?? <Flame aria-hidden="true" />}
          </span>
        )}
        {children ?? (
          <span>
            {resolvedDays}
            {label ? ` ${label}` : ''}
          </span>
        )}
      </span>
    );
  }
);

StreakBadge.displayName = 'StreakBadge';
