/**
 * Checkbox Component (Atom)
 * @description Checkbox input element with optional label
 */

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, useCallback } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: ReactNode;
  hint?: ReactNode;
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, size = 'md', disabled, onChange, label, hint, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;
    const hintId = `${checkboxId}-hint`;
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      onChange?.(e);
    }, [onCheckedChange, onChange]);

    const control = (
      <input
        ref={ref}
        id={checkboxId}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        aria-describedby={hint !== undefined ? hintId : undefined}
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

    if (label === undefined && hint === undefined) {
      return control;
    }
    return (
      <div className="flex items-start gap-2">
        {control}
        <div className="min-w-0">
          {label !== undefined && (
            <label htmlFor={checkboxId} className="cursor-pointer select-none text-sm leading-5">
              {label}
            </label>
          )}
          {hint !== undefined && (
            <p id={hintId} className="text-xs leading-snug text-muted-foreground">
              {hint}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
