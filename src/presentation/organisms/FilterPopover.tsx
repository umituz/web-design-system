/**
 * FilterPopover Component (Organism)
 * @description List-toolbar filter trigger with an active-filter count badge;
 * hosts arbitrary filter controls inside a Popover
 */

import { useState, type ReactNode } from 'react';
import { Filter } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import { Button } from '../atoms/Button';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

export interface FilterPopoverProps {
  /** Trigger caption; defaults to "Filters". */
  label?: string;
  /** Active filter count; rendered as a badge when greater than zero. */
  count?: number;
  /** Popover alignment relative to the trigger; defaults to "start". */
  align?: 'start' | 'center' | 'end';
  children: ReactNode;
  className?: string;
}

export function FilterPopover({ label = 'Filters', count, align = 'start', children, className }: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" aria-expanded={open}>
          <Filter size={14} aria-hidden="true" />
          {label}
          {count != null && count > 0 && (
            <span
              className={cn(
                'ml-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold leading-4 text-background'
              )}
            >
              {count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className={cn('w-64', className)}>
        {children}
      </PopoverContent>
    </Popover>
  );
}
