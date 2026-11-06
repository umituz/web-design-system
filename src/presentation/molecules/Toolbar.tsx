import * as React from 'react';
import { cn } from '../../infrastructure/utils';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  search?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ search, filters, actions, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full',
          className
        )}
        {...props}
      >
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {search && <div className="w-full sm:w-72 max-w-full">{search}</div>}
          {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
          {children}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0 justify-end">
            {actions}
          </div>
        )}
      </div>
    );
  }
);

Toolbar.displayName = 'Toolbar';
