/**
 * Accordion Component (Organism)
 * @description Collapsible content sections
 */

import { useState, useCallback, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import { Icon } from '../atoms/Icon';

export interface AccordionItem {
  value: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultValue?: string[];
  variant?: 'default' | 'bordered' | 'ghost';
}

const variantStyles: Record<'default' | 'bordered' | 'ghost', string> = {
  default: 'border-b',
  bordered: 'border rounded-lg mb-2',
  ghost: 'border-0',
};

export function Accordion({
  items,
  allowMultiple = false,
  defaultValue = [],
  variant = 'default',
  className,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultValue);

  const toggleItem = useCallback((value: string) => {
    setOpenItems((prev) => {
      const isOpen = prev.includes(value);

      if (allowMultiple) {
        return isOpen
          ? prev.filter((v) => v !== value)
          : [...prev, value];
      } else {
        return isOpen ? [] : [value];
      }
    });
  }, [allowMultiple]);

  return (
    <div className={cn('w-full', className)} {...props}>
      {items.map((item, index) => {
        const isOpen = openItems.includes(item.value);

        return (
          <div
            key={item.value}
            className={cn(
              'group',
              variantStyles[variant],
              variant === 'bordered' && isOpen && 'ring-1 ring-ring'
            )}
          >
            {/* Header */}
            <button
              onClick={() => toggleItem(item.value)}
              disabled={item.disabled}
              className={cn(
                'flex w-full items-center justify-between py-4 font-medium transition-all',
                'hover:text-foreground',
                item.disabled && 'opacity-50 cursor-not-allowed',
                variant === 'bordered' && 'px-4'
              )}
            >
              <span>{item.title}</span>
              <Icon
                className={cn(
                  'transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
                size="sm"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </Icon>
            </button>

            {/* Content */}
            {isOpen && (
              <div
                className={cn(
                  'overflow-hidden',
                  'animate-accordion-down',
                  variant === 'bordered' && 'px-4 pb-4'
                )}
              >
                <div className="pb-4 text-sm text-muted-foreground">
                  {item.content}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

Accordion.displayName = 'Accordion';
