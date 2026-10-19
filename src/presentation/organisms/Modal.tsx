/**
 * Modal Component (Organism)
 * @description Convenience modal with title, description, size and footer presets
 */

import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './Dialog';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  subtitle?: ReactNode;
  size?: ModalSize;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentProps?: React.ComponentProps<typeof DialogContent>;
}

const sizeWidths: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  subtitle,
  size = 'md',
  footer,
  children,
  className,
  contentProps,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className={`${sizeWidths[size]} ${className ?? ''}`} {...contentProps}>
        {(title !== undefined || description !== undefined || subtitle !== undefined) && (
          <DialogHeader>
            {title !== undefined && <DialogTitle>{title}</DialogTitle>}
            {(subtitle ?? description) !== undefined && <DialogDescription>{subtitle ?? description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
        {footer !== undefined && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
