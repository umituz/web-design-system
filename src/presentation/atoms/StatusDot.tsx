import * as React from 'react';
import { cn } from '../../infrastructure/utils';

export type StatusType =
  | 'online'
  | 'offline'
  | 'busy'
  | 'away'
  | 'pending'
  | 'success'
  | 'warning'
  | 'error';

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
  ping?: boolean;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const colorMap: Record<StatusType, { dot: string; ping: string }> = {
  online: { dot: 'bg-emerald-500', ping: 'bg-emerald-400' },
  success: { dot: 'bg-emerald-500', ping: 'bg-emerald-400' },
  busy: { dot: 'bg-rose-500', ping: 'bg-rose-400' },
  error: { dot: 'bg-rose-500', ping: 'bg-rose-400' },
  away: { dot: 'bg-amber-500', ping: 'bg-amber-400' },
  warning: { dot: 'bg-amber-500', ping: 'bg-amber-400' },
  pending: { dot: 'bg-sky-500', ping: 'bg-sky-400' },
  offline: { dot: 'bg-zinc-400 dark:bg-zinc-500', ping: 'bg-zinc-300' },
};

const dotSizeMap = {
  xs: 'size-1.5',
  sm: 'size-2',
  md: 'size-2.5',
  lg: 'size-3.5',
};

const textSizeMap = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ status, ping = false, label, size = 'sm', className, ...props }, ref) => {
    const colors = colorMap[status] ?? colorMap.offline;

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center gap-2 select-none', textSizeMap[size], className)}
        {...props}
      >
        <span className="relative flex shrink-0 items-center justify-center">
          {ping && status !== 'offline' && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                colors.ping
              )}
            />
          )}
          <span
            className={cn(
              'relative inline-flex rounded-full',
              dotSizeMap[size],
              colors.dot
            )}
          />
        </span>
        {label && <span className="text-foreground/90 font-medium">{label}</span>}
      </span>
    );
  }
);

StatusDot.displayName = 'StatusDot';
