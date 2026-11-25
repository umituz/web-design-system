import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import { ActivityItem, type ActivityItemProps } from './ActivityItem';

export interface ActivityListEntry extends Omit<ActivityItemProps, 'className'> {
  id: string;
}

export interface ActivityListProps extends HTMLAttributes<HTMLUListElement>, BaseProps {
  items?: ActivityListEntry[];
  emptyMessage?: ReactNode;
}

export const ActivityList = forwardRef<HTMLUListElement, ActivityListProps>(
  ({ className, items, emptyMessage, children, ...props }, ref) => {
    if (items && items.length === 0 && emptyMessage) {
      return (
        <div className={cn('py-4 text-center text-sm text-muted-foreground', className)}>
          {emptyMessage}
        </div>
      );
    }

    return (
      <ul
        ref={ref}
        className={cn('divide-y divide-border', className)}
        {...props}
      >
        {items
          ? items.map((item) => (
              <ActivityItem key={item.id} {...item} />
            ))
          : children}
      </ul>
    );
  }
);

ActivityList.displayName = 'ActivityList';
