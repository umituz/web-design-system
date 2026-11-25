import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import { InsightItem, type InsightItemProps } from './InsightItem';

export interface InsightListEntry extends Omit<InsightItemProps, 'className'> {
  id: string;
}

export interface InsightListProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  items?: InsightListEntry[];
  emptyMessage?: ReactNode;
  variant?: 'minimal' | 'callout';
}

export const InsightList = forwardRef<HTMLDivElement, InsightListProps>(
  ({ className, items, emptyMessage, variant = 'minimal', children, ...props }, ref) => {
    if (items && items.length === 0 && emptyMessage) {
      return (
        <div ref={ref} className={cn('py-4 text-center text-sm text-muted-foreground', className)} {...props}>
          {emptyMessage}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          variant === 'callout' ? 'space-y-2.5' : 'space-y-3.5',
          className
        )}
        {...props}
      >
        {items
          ? items.map((item) => (
              <InsightItem key={item.id} variant={variant} {...item} />
            ))
          : children}
      </div>
    );
  }
);

InsightList.displayName = 'InsightList';
