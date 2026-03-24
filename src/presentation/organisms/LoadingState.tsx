/**
 * LoadingState Component (Organism)
 * @description Component for displaying loading states (Responsive)
 */

import { forwardRef } from 'react';
import { cn, getSpacing, getGap } from '../../infrastructure/utils';
import { Spinner } from '../atoms/Spinner';
import type { BaseProps, SizeVariant } from '../../domain/types';

export interface LoadingStateProps extends BaseProps {
  message?: string;
  size?: Extract<SizeVariant, 'sm' | 'md' | 'lg'>;
  variant?: 'spinner' | 'skeleton' | 'dots';
  centered?: boolean;
}

export const LoadingState = forwardRef<HTMLDivElement, LoadingStateProps>(
  (
    {
      className,
      message,
      size = 'md',
      variant = 'spinner',
      centered = true,
      ...props
    },
    ref
  ) => {
    const spinnerSize: 'sm' | 'md' | 'lg' = size;
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center',
          getGap(size),
          getSpacing('p', size),
          centered && 'min-h-[200px] sm:min-h-[300px]',
          className
        )}
        {...props}
      >
        {variant === 'spinner' && <Spinner size={spinnerSize} />}
        {variant === 'dots' && (
          <div className="flex gap-1 sm:gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 bg-primary rounded-full animate-bounce',
                  'w-1.5 h-1.5 sm:w-2 sm:h-2',
                  'lg:w-2.5 h-2.5'
                )}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
        {variant === 'skeleton' && (
          <div className="w-full space-y-2 sm:space-y-3">
            <div className="h-3 sm:h-4 bg-muted animate-pulse rounded w-2/3 sm:w-1/2" />
            <div className="h-2.5 sm:h-3 bg-muted animate-pulse rounded w-full" />
            <div className="h-2.5 sm:h-3 bg-muted animate-pulse rounded w-3/4" />
          </div>
        )}
        {message && variant !== 'skeleton' && (
          <p className={cn('text-muted-foreground mt-2 sm:mt-3', size === 'sm' ? 'text-xs sm:text-sm' : size === 'md' ? 'text-sm sm:text-base' : 'text-base sm:text-lg', 'text-center max-w-md')}>{message}</p>
        )}
      </div>
    );
  }
);

LoadingState.displayName = 'LoadingState';
