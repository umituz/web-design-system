/**
 * FormModal Component (Template)
 * @description Pre-configured modal with form wrapper and loading state
 * Reduces boilerplate in modal components like CampaignModal, ProjectListModal
 */

import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './Dialog';
import { Button } from '../atoms';
import { Loader2 } from 'lucide-react';
import type { BaseProps } from '../../domain/types';

export interface FormModalProps extends BaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void | Promise<void>;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  showFooter?: boolean;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  preventCloseOnSubmit?: boolean;
}

const sizeStyles = {
  sm: 'sm:max-w-[400px]',
  md: 'sm:max-w-[425px]',
  lg: 'sm:max-w-[600px]',
  xl: 'sm:max-w-[800px]',
  full: 'sm:max-w-[95vw]',
};

export const FormModal = forwardRef<HTMLDivElement, FormModalProps>(
  (
    {
      className,
      open,
      onOpenChange,
      title,
      description,
      children,
      onSubmit,
      loading = false,
      submitText = 'Submit',
      cancelText = 'Cancel',
      showFooter = true,
      footer,
      size = 'md',
      preventCloseOnSubmit = false,
      ...props
    },
    ref
  ) => {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit && !loading) {
        await onSubmit(e);
        if (!preventCloseOnSubmit) {
          onOpenChange(false);
        }
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn(sizeStyles[size], className)} ref={ref} {...props}>
          {onSubmit ? (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                {description && <DialogDescription>{description}</DialogDescription>}
              </DialogHeader>
              <div className="grid gap-4 py-4">{children}</div>
              {showFooter && (
                <DialogFooter>
                  {footer || (
                    <>
                      <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        {cancelText}
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {submitText}
                      </Button>
                    </>
                  )}
                </DialogFooter>
              )}
            </form>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                {description && <DialogDescription>{description}</DialogDescription>}
              </DialogHeader>
              <div className="grid gap-4 py-4">{children}</div>
              {showFooter && (
                <DialogFooter>
                  {footer || (
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                      {cancelText}
                    </Button>
                  )}
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  }
);

FormModal.displayName = 'FormModal';
