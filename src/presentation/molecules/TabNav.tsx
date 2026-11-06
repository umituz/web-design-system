import * as React from 'react';
import { NavLink } from 'react-router';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface TabNavItem {
  to: string;
  label: string;
  end?: boolean;
}

export interface TabNavProps extends BaseProps {
  items: readonly TabNavItem[];
}

export const TabNav: React.FC<TabNavProps> = ({ items, className }) => {
  return (
    <nav
      className={cn(
        'flex items-center gap-1 border-b border-border overflow-x-auto py-1',
        className
      )}
      aria-label="Section tabs"
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap',
              isActive
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

TabNav.displayName = 'TabNav';
