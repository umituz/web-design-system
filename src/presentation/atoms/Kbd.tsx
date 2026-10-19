/**
 * Kbd Component (Atom)
 * @description Keyboard key cap, e.g. for shortcut hints
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface KbdProps extends HTMLAttributes<HTMLElement>, BaseProps {}

export const Kbd = forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => (
  <kbd
    ref={ref}
    className={cn(
      'inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-semibold text-muted-foreground',
      className
    )}
    {...props}
  />
));

Kbd.displayName = 'Kbd';
