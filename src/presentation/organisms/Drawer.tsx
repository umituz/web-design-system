/**
 * Drawer Component (Organism)
 * @description Slide-over panel built on the Sheet compound with a
 * Modal-like prop surface (title, footer, side presets, wide variant)
 */

import type { ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from './Sheet';

export type DrawerSide = 'top' | 'bottom' | 'left' | 'right';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  side?: DrawerSide;
  wide?: boolean;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentProps?: React.ComponentProps<typeof SheetContent>;
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  description,
  side = 'right',
  wide = false,
  footer,
  children,
  className,
  contentProps,
}: DrawerProps) {
  const wideSize = wide && (side === 'left' || side === 'right') ? 'sm:max-w-2xl' : undefined;
  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetContent
        side={side}
        className={cn('flex flex-col overflow-hidden', wideSize, className)}
        {...contentProps}
      >
        {(title !== undefined || description !== undefined || subtitle !== undefined) && (
          <SheetHeader>
            {title !== undefined && <SheetTitle>{title}</SheetTitle>}
            {(subtitle ?? description) !== undefined && (
              <SheetDescription>{subtitle ?? description}</SheetDescription>
            )}
          </SheetHeader>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer !== undefined && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}
