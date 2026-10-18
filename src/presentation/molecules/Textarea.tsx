/**
 * Textarea Component (Molecule)
 * @description Multi-line text input with optional label and helper text
 */

import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseProps {
  error?: boolean | string;
  hint?: ReactNode;
  label?: ReactNode;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

const resizeStyles: Record<'none' | 'both' | 'horizontal' | 'vertical', string> = {
  none: 'resize-none',
  both: 'resize',
  horizontal: 'resize-x',
  vertical: 'resize-y',
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, hint, label, resize = 'vertical', id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const hasError = Boolean(error);
    const errorText = typeof error === 'string' && error.length > 0 ? error : undefined;
    const hintId = `${textareaId}-hint`;
    const control = (
      <textarea
        ref={ref}
        id={textareaId}
        aria-invalid={hasError || undefined}
        aria-describedby={hint !== undefined || errorText !== undefined ? hintId : undefined}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2',
          'text-sm ring-offset-background',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasError ? 'border-destructive' : 'border-input',
          resizeStyles[resize],
          className
        )}
        {...props}
      />
    );
    if (label === undefined && hint === undefined && !errorText) {
      return control;
    }
    return (
      <div className="w-full">
        {label !== undefined && (
          <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium">
            {label}
          </label>
        )}
        {control}
        {(errorText !== undefined || hint !== undefined) && (
          <p id={hintId} className={cn('mt-1.5 text-xs', errorText ? 'text-destructive' : 'text-muted-foreground')}>
            {errorText ?? hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
