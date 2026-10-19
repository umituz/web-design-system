/**
 * Skeleton Component (Atom)
 * @description Loading placeholder
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, BaseProps {
  variant?: 'text' | 'circular' | 'rectangular';
  rows?: number;
}

const variantStyles: Record<'text' | 'circular' | 'rectangular', string> = {
  text: 'h-4 w-full rounded',
  circular: 'h-12 w-12 rounded-full',
  rectangular: 'h-24 w-full rounded',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', rows, ...props }, ref) => {
    if (rows !== undefined && rows > 0) {
      return (
        <div ref={ref} role="status" aria-label="Loading" className={cn('flex w-full flex-col gap-2', className)} {...props}>
          {Array.from({ length: rows }, (_, index) => (
            <div
              key={index}
              className={cn('animate-pulse bg-muted h-4 w-full rounded', index === rows - 1 ? 'w-3/5' : undefined)}
            />
          ))}
        </div>
      );
    }
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
