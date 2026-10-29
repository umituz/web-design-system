/**
 * Modal Component (Organism)
 * @description Convenience modal with title, description, size and footer presets
 */

import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './Dialog';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  subtitle?: ReactNode;
  size?: ModalSize;
  danger?: boolean;
  scrollable?: boolean;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentProps?: React.ComponentProps<typeof DialogContent>;
}

const sizeWidths: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-5xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  subtitle,
  size = 'md',
  danger = false,
  scrollable = false,
  footer,
  children,
  className,
  contentProps,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent
        className={cn(
          sizeWidths[size],
          danger && 'border-destructive',
          scrollable && 'flex max-h-[92vh] flex-col overflow-hidden',
          className,
        )}
        {...contentProps}
      >
        {(title !== undefined || description !== undefined || subtitle !== undefined) && (
          <DialogHeader>
            {title !== undefined && (
              <DialogTitle className={danger ? 'flex items-center gap-2 text-destructive' : undefined}>
                {danger && <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />}
                {title}
              </DialogTitle>
            )}
            {(subtitle ?? description) !== undefined && <DialogDescription>{subtitle ?? description}</DialogDescription>}
          </DialogHeader>
        )}
        {scrollable ? <div className="min-h-0 flex-1 overflow-y-auto">{children}</div> : children}
        {footer !== undefined && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
