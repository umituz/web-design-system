import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface ActivityItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'>, BaseProps {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  asChild?: boolean;
}

export const ActivityItem = forwardRef<HTMLLIElement, ActivityItemProps>(
  ({ className, icon, title, subtitle, trailing, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'li';
    return (
      <Comp
        ref={ref}
        className={cn('flex items-center gap-3.5 py-3 text-left', className)}
        {...props}
      >
        {children ?? (
          <>
            {icon && <span className="shrink-0 text-muted-foreground" aria-hidden="true">{icon}</span>}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">{title}</div>
              {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
            </div>
            {trailing && <div className="shrink-0 text-xs font-medium text-muted-foreground">{trailing}</div>}
          </>
        )}
      </Comp>
    );
  }
);

ActivityItem.displayName = 'ActivityItem';
