/**
 * Input Component (Atom)
 * @description Text input field with optional label and helper text
 */

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import type { MediumSizes } from '../../infrastructure/constants';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>, BaseProps {
  error?: boolean | string;
  hint?: ReactNode;
  icon?: ReactNode;
  label?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  size?: MediumSizes;
}

const sizeStyles: Record<MediumSizes, string> = {
  sm: 'h-8 text-sm',
  md: 'h-9 text-sm',
  lg: 'h-10 text-base',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, hint, icon, label, prefix, suffix, size = 'md', type = 'text', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasError = Boolean(error);
    const errorText = typeof error === 'string' && error.length > 0 ? error : undefined;
    const hintId = `${inputId}-hint`;
    const control = (
      <input
        ref={ref}
        id={inputId}
        type={type}
        aria-invalid={hasError || undefined}
        aria-describedby={hint !== undefined || errorText !== undefined ? hintId : undefined}
        className={cn(
          'flex w-full rounded-md border bg-background px-3 py-2',
          'text-sm ring-offset-background',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          sizeStyles[size],
          hasError ? 'border-destructive' : 'border-input',
          icon !== undefined && 'pl-9',
          prefix !== undefined && 'pl-7',
          suffix !== undefined && 'pr-7',
          className
        )}
        {...props}
      />
    );
    const decorated = icon !== undefined || prefix !== undefined || suffix !== undefined ? (
      <div className="relative">
        {icon !== undefined && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">{icon}</span>
        )}
        {prefix !== undefined && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" aria-hidden>
            {prefix}
          </span>
        )}
        {control}
        {suffix !== undefined && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" aria-hidden>
            {suffix}
          </span>
        )}
      </div>
    ) : (
      control
    );
    if (label === undefined && hint === undefined && !errorText) {
      return decorated;
    }
    return (
      <div className="w-full">
        {label !== undefined && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium">
            {label}
          </label>
        )}
        {decorated}
        {(errorText !== undefined || hint !== undefined) && (
          <p id={hintId} className={cn('mt-1.5 text-xs', errorText ? 'text-destructive' : 'text-muted-foreground')}>
            {errorText ?? hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
