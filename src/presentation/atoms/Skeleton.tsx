/**
 * Skeleton Component (Atom)
 * @description Loading placeholder
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  variant?: 'text' | 'circular' | 'rectangular';
}

const variantStyles: Record<'text' | 'circular' | 'rectangular', string> = {
  text: 'h-4 w-full rounded',
  circular: 'h-12 w-12 rounded-full',
  rectangular: 'h-24 w-full rounded',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-muted',
          variantStyles[variant],
          className
        )}
        role="status"
        aria-label="Loading"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
