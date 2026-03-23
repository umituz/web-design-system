/**
 * Textarea Component (Molecule)
 * @description Multi-line text input
 */

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import type { BaseProps } from '../../domain/types';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseProps {
  error?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

const resizeStyles: Record<'none' | 'both' | 'horizontal' | 'vertical', string> = {
  none: 'resize-none',
  both: 'resize',
  horizontal: 'resize-x',
  vertical: 'resize-y',
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, resize = 'vertical', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2',
          'text-sm ring-offset-background',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
          resizeStyles[resize],
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
