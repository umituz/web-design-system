/**
 * LoadingState Component (Organism)
 * @description Component for displaying loading states
 */

import { forwardRef } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import { Spinner } from '../atoms/Spinner';
import type { BaseProps, SizeVariant } from '../../domain/types';

export interface LoadingStateProps extends BaseProps {
  message?: string;
  size?: Extract<SizeVariant, 'sm' | 'md' | 'lg'>;
  variant?: 'spinner' | 'skeleton' | 'dots';
}

const sizeStyles = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-5',
};

const spinnerSizeStyles = {
  sm: 'sm' as const,
  md: 'md' as const,
  lg: 'lg' as const,
};

const messageSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const LoadingState = forwardRef<HTMLDivElement, LoadingStateProps>(
  (
    {
      className,
      message,
      size = 'md',
      variant = 'spinner',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center p-8',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {variant === 'spinner' && <Spinner size={spinnerSizeStyles[size]} />}
        {variant === 'dots' && (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 bg-primary rounded-full animate-bounce',
                  size === 'sm' && 'w-1.5 h-1.5',
                  size === 'lg' && 'w-3 h-3'
                )}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
        {variant === 'skeleton' && (
          <div className="w-full space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded" style={{ width: '40%' }} />
            <div className="h-3 bg-muted animate-pulse rounded" style={{ width: '70%' }} />
            <div className="h-3 bg-muted animate-pulse rounded" style={{ width: '60%' }} />
          </div>
        )}
        {message && variant !== 'skeleton' && (
          <p className={cn('text-muted-foreground mt-2', messageSizeStyles[size])}>{message}</p>
        )}
      </div>
    );
  }
);

LoadingState.displayName = 'LoadingState';
