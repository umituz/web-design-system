import { forwardRef } from 'react';
import { Eye } from 'lucide-react';
import { cn, formatCompact } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface ViewerCountProps extends BaseProps {
  count: number;
  label?: string;
}

export const ViewerCount = forwardRef<HTMLSpanElement, ViewerCountProps>(
  ({ className, count, label = 'watching', ...props }, ref) => (
    <span
      ref={ref}
      className={cn('inline-flex items-center gap-1.5 text-xs text-muted-foreground', className)}
      {...props}
    >
      <Eye aria-hidden="true" className="h-3.5 w-3.5" />
      <span aria-label={`${count.toLocaleString()} ${label}`}>{formatCompact(count)}</span>
    </span>
  ),
);

ViewerCount.displayName = 'ViewerCount';
