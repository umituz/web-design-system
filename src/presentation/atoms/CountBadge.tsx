import { forwardRef } from 'react';
import { cn, formatBadgeCount } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface CountBadgeProps extends BaseProps {
  count: number;
  cap?: number;
  unreadLabel?: string;
}

export const CountBadge = forwardRef<HTMLSpanElement, CountBadgeProps>(
  ({ className, count, cap = 9, unreadLabel = 'unread', ...props }, ref) => {
    if (count <= 0) return null;
    return (
      <span
        ref={ref}
        aria-label={`${count} ${unreadLabel}`}
        className={cn(
          'inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-semibold leading-none text-destructive-foreground',
          className,
        )}
        {...props}
      >
        {formatBadgeCount(count, cap)}
      </span>
    );
  },
);

CountBadge.displayName = 'CountBadge';
