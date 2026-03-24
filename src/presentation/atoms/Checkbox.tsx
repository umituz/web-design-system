/**
 * Checkbox Component (Atom)
 * @description Checkbox input element
 */

import { forwardRef, type InputHTMLAttributes, useCallback } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, size = 'md', disabled, onChange, ...props }, ref) => {
    // FIX: Memoize handleChange to prevent re-renders
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      onChange?.(e);
    }, [onCheckedChange, onChange]);

    return (
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          'shrink-0 rounded border border-primary ring-offset-background',
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

Checkbox.displayName = 'Checkbox';
