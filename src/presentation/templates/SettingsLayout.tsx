import * as React from 'react';
import { cn } from '../../infrastructure/utils';

export interface SettingsNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

export interface SettingsLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'onSelect'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  navItems: SettingsNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  actions?: React.ReactNode;
}

export const SettingsLayout = React.forwardRef<HTMLDivElement, SettingsLayoutProps>(
  (
    {
      title = 'Ayarlar',
      description,
      navItems,
      activeId,
      onSelect,
      actions,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('w-full max-w-6xl mx-auto flex flex-col gap-6 p-4 sm:p-6 lg:p-8', className)}
        {...props}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Navigation Sidebar */}
          <nav
            aria-label="Settings navigation"
            className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0"
          >
            {navItems.map((item) => {
              const isActive = item.id === activeId;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left shrink-0 whitespace-nowrap lg:whitespace-normal',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    item.disabled && 'opacity-50 pointer-events-none'
                  )}
                >
                  {item.icon && (
                    <span className="shrink-0 size-4 flex items-center justify-center [&_svg]:size-4">
                      {item.icon}
                    </span>
                  )}
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground ml-auto">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Main Panel Content */}
          <main className="flex-1 w-full min-w-0">{children}</main>
        </div>
      </div>
    );
  }
);

SettingsLayout.displayName = 'SettingsLayout';
