/**
 * IconButton Component (Atom)
 * @description Round button optimized for icon-only usage with consistent sizing
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import type { SmallSizes, MediumSizes } from '../../infrastructure/constants';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    BaseProps {
  icon: ReactNode;
  label: string;
  size?: SmallSizes | MediumSizes;
  variant?: 'default' | 'ghost' | 'outline';
}

const sizeStyles: Record<SmallSizes | MediumSizes, string> = {
  xs: 'h-7 w-7',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const variantStyles: Record<'default' | 'ghost' | 'outline', string> = {
  default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, label, size = 'md', variant = 'ghost', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon}
    </button>
  )
);

IconButton.displayName = 'IconButton';
