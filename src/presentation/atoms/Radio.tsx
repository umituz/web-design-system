/**
 * Radio Component (Atom)
 * @description Radio input element
 */

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseProps {
  value: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, size = 'md', disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="radio"
        disabled={disabled}
        className={cn(
          'shrink-0 rounded-full border border-primary ring-offset-background',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'accent-primary',
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Radio.displayName = 'Radio';
