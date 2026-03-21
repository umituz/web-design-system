/**
 * Toggle Component (Molecule)
 * @description Switch/toggle button
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-5 w-9',
  md: 'h-6 w-11',
  lg: 'h-7 w-13',
};

const thumbSizeStyles = {
  sm: 'h-4 w-4 data-[state=checked:translate-x-4',
  md: 'h-5 w-5 data-[state=checked:translate-x-5',
  lg: 'h-6 w-6 data-[state=checked:translate-x-6',
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed = false, onPressedChange, size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={pressed}
        disabled={disabled}
        data-state={pressed ? 'checked' : 'unchecked'}
        onClick={() => onPressedChange?.(!pressed)}
        className={cn(
          'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
            thumbSizeStyles[size],
            'data-[state=unchecked]:translate-x-0'
          )}
        />
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';
