/**
 * Checklist Component (Organism)
 * @description Toggleable checklist with completion progress and done-by metadata
 */

import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import { Progress } from '../atoms/Progress';

export interface ChecklistItem {
  id: string;
  label: ReactNode;
  done: boolean;
  doneAt?: string;
  doneBy?: string;
}

export interface ChecklistProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onToggle'>, BaseProps {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}

export const Checklist = forwardRef<HTMLDivElement, ChecklistProps>(
  ({ items, onToggle, className, ...props }, ref) => {
    const done = items.filter((i) => i.done).length;
    return (
      <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
        <div className="flex items-center justify-between gap-2.5">
          <span className="text-xs text-muted-foreground">
            {done} of {items.length} complete
          </span>
          <Progress value={(done / Math.max(1, items.length)) * 100} size="sm" tone={done === items.length ? 'success' : 'primary'} />
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors',
              item.done ? 'border-success/30 bg-success/5 text-muted-foreground' : 'border-border hover:border-primary/40'
            )}
            onClick={() => onToggle(item.id)}
            role="checkbox"
            aria-checked={item.done}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onToggle(item.id);
              }
            }}
          >
            <span
              aria-hidden="true"
              className={cn(
                'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                item.done ? 'border-success bg-success text-success-foreground' : 'border-input bg-background'
              )}
            >
              {item.done && <Check className="h-3 w-3" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn('leading-snug', item.done && 'line-through decoration-muted-foreground/50')}>{item.label}</span>
              {item.done && item.doneBy && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  · {item.doneBy}
                  {item.doneAt ? `, ${new Date(item.doneAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    );
  }
);

Checklist.displayName = 'Checklist';
