/**
 * Input Component (Atom)
 * @description Text input field
 */

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import type { MediumSizes } from '../../infrastructure/constants';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseProps {
  error?: boolean;
  size?: MediumSizes;
}

const sizeStyles: Record<MediumSizes, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-3 text-sm',
  lg: 'h-10 px-4 text-base',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, size = 'md', type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex w-full rounded-md border bg-background px-3 py-2',
          'text-sm ring-offset-background',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          sizeStyles[size],
          error ? 'border-destructive' : 'border-input',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
