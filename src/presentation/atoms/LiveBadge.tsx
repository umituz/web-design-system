import { forwardRef } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface LiveBadgeProps extends BaseProps {
  label?: string;
}

export const LiveBadge = forwardRef<HTMLSpanElement, LiveBadgeProps>(
  ({ className, label = 'Live', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-destructive px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-destructive-foreground',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
      </span>
      {label}
    </span>
  ),
);

LiveBadge.displayName = 'LiveBadge';
