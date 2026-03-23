/**
 * Tabs Component (Organism)
 * @description Tabbed interface
 */

import { useState, useCallback, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import type { BaseProps, ChildrenProps } from '../../domain/types';

export interface Tab {
  value: string;
  label: string;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  tabs: Tab[];
  defaultValue?: string;
  variant?: 'default' | 'pills' | 'underline';
}

const variantStyles: Record<'default' | 'pills' | 'underline', string> = {
  default: 'bg-muted p-1 rounded-lg gap-1',
  pills: 'bg-transparent gap-2',
  underline: 'bg-transparent border-b gap-6',
};

const tabVariantStyles: Record<'default' | 'pills' | 'underline', { base: string; active: string }> = {
  default: {
    base: 'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
    active: 'bg-background text-foreground shadow-sm',
  },
  pills: {
    base: 'px-4 py-2 rounded-full text-sm font-medium transition-all',
    active: 'bg-primary text-primary-foreground',
  },
  underline: {
    base: 'px-1 pb-3 text-sm font-medium transition-all border-b-2 border-transparent',
    active: 'text-foreground border-primary',
  },
};

export function Tabs({ tabs, defaultValue, variant = 'default', className, ...props }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);

  const handleTabChange = useCallback((value: string) => {
    const tab = tabs.find((t) => t.value === value);
    if (tab && !tab.disabled) {
      setActiveTab(value);
    }
  }, [tabs]);

  const currentTab = tabs.find((t) => t.value === activeTab);

  return (
    <div className={cn('w-full', className)} {...props}>
      {/* Tab List */}
      <div
        role="tablist"
        className={cn('inline-flex w-full', variantStyles[variant])}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          const styles = tabVariantStyles[variant];

          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                styles.base,
                isActive
                  ? styles.active
                  : 'text-muted-foreground hover:text-foreground',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div
        role="tabpanel"
        className="mt-4"
      >
        {currentTab?.content}
      </div>
    </div>
  );
}

Tabs.displayName = 'Tabs';
