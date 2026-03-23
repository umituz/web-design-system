/**
 * ConfirmDialog Component (Organism)
 * @description Confirmation dialog for destructive actions
 * Reduces boilerplate in delete/remove confirmation modals
 */

import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './Dialog';
import { Button } from '../atoms';
import { AlertTriangle } from 'lucide-react';
import type { BaseProps } from '../../domain/types';

export interface ConfirmDialogProps extends BaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message?: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  icon?: ReactNode;
}

export const ConfirmDialog = forwardRef<HTMLDivElement, ConfirmDialogProps>(
  (
    {
      className,
      open,
      onOpenChange,
      title,
      message,
      description,
      onConfirm,
      loading = false,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      variant = 'destructive',
      icon,
      ...props
    },
    ref
  ) => {
    const handleConfirm = async () => {
      if (!loading) {
        await onConfirm();
        onOpenChange(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn('sm:max-w-[425px]', className)} ref={ref} {...props}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              {icon || (
                variant === 'destructive' && (
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                )
              )}
              <DialogTitle>{title}</DialogTitle>
            </div>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {message && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              {cancelText}
            </Button>
            <Button variant={variant} onClick={handleConfirm} disabled={loading}>
              {loading && <span className="mr-2 h-4 w-4 animate-spin">⟳</span>}
              {confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

ConfirmDialog.displayName = 'ConfirmDialog';
