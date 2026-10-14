/**
 * KeyValueList Component (Organism)
 * @description Definition list of label → value rows (drawers, detail panels).
 */

import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface KeyValueItem {
  label: ReactNode;
  value: ReactNode;
}

export interface KeyValueListProps extends HTMLAttributes<HTMLDListElement>, BaseProps {
  items: KeyValueItem[];
}

export const KeyValueList = forwardRef<HTMLDListElement, KeyValueListProps>(
  ({ className, items, ...props }, ref) => (
    <dl ref={ref} className={cn('grid gap-1.5 py-1 text-sm', className)} {...props}>
      {items.map((item, i) => (
        <div key={i} className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 text-right font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  ),
);

KeyValueList.displayName = 'KeyValueList';
