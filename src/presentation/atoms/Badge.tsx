/**
 * Badge Component (Atom)
 * @description Small status or label indicator
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import type { BaseProps, ColorVariant, SizeVariant } from '../../domain/types';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  variant?: ColorVariant;
  size?: Extract<SizeVariant, 'sm' | 'md' | 'lg'>;
}

const variantStyles: Record<ColorVariant, string> = {
  primary: 'bg-primary text-primary-foreground border-primary',
  secondary: 'bg-secondary text-secondary-foreground border-secondary',
  success: 'bg-success text-success-foreground border-success',
  warning: 'bg-warning text-warning-foreground border-warning',
  destructive: 'bg-destructive text-destructive-foreground border-destructive',
};

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border font-medium',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
