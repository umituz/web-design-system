/**
 * Tabs Component (Organism)
 * @description Tabbed interface
 */

import { useRef, useState, useCallback, type KeyboardEvent, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface Tab {
  value: string;
  label: string;
  content?: ReactNode;
  disabled?: boolean;
  count?: number;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  tabs: Tab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  ariaLabel?: string;
  panelId?: string;
  /** Render only the tab list (e.g. URL-driven tabs whose content lives elsewhere). */
  showPanel?: boolean;
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

export function Tabs({ tabs, defaultValue, value, onValueChange, variant = 'default', ariaLabel, panelId, showPanel = true, className, ...props }: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [internalTab, setInternalTab] = useState(defaultValue || tabs[0]?.value);
  const activeTab = value ?? internalTab;

  const handleTabChange = useCallback(
    (next: string) => {
      const tab = tabs.find((t) => t.value === next);
      if (tab && !tab.disabled) {
        setInternalTab(next);
        onValueChange?.(next);
      }
    },
    [tabs, onValueChange]
  );

  const moveFocus = useCallback(
    (direction: 1 | -1) => {
      const buttons = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])') ?? []);
      if (buttons.length === 0) return;
      const currentIndex = buttons.findIndex((button) => button.getAttribute('data-state') === 'active');
      const next = buttons[(currentIndex + direction + buttons.length) % buttons.length];
      if (next) {
        next.focus();
        next.click();
      }
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveFocus(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveFocus(-1);
      }
    },
    [moveFocus]
  );

  const currentTab = tabs.find((t) => t.value === activeTab);

  return (
    <div className={cn('w-full', className)} {...props}>
      {/* Tab List */}
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className={cn('inline-flex w-full', variantStyles[variant])}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          const styles = tabVariantStyles[variant];

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              data-state={isActive ? 'active' : 'inactive'}
              aria-controls={showPanel ? panelId : undefined}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                'inline-flex items-center gap-1.5',
                styles.base,
                isActive
                  ? styles.active
                  : 'text-muted-foreground hover:text-foreground',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.label}
              {typeof tab.count === 'number' && (
                <span className="rounded-full bg-muted px-1.5 text-xs leading-4 text-muted-foreground">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {showPanel && (
        <div
          role="tabpanel"
          id={panelId}
          className="mt-4"
        >
          {currentTab?.content}
        </div>
      )}
    </div>
  );
}

Tabs.displayName = 'Tabs';
