/**
 * EmptyState Component (Organism)
 * @description Component for displaying empty states with optional actions
 */

import { forwardRef } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import type { BaseProps, SizeVariant } from '../../domain/types';

export interface EmptyStateProps extends BaseProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: Extract<SizeVariant, 'sm' | 'md' | 'lg' | 'xl'>;
}

const sizeStyles = {
  sm: 'p-6 gap-3',
  md: 'p-8 gap-4',
  lg: 'p-12 gap-5',
  xl: 'p-16 gap-6',
};

const iconSizeStyles = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-20 w-20',
};

const titleSizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const descriptionSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon: Icon,
      title,
      description,
      action,
      size = 'md',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {Icon && (
          <Icon className={cn(iconSizeStyles[size], 'text-muted-foreground/50 mx-auto mb-2')} />
        )}
        <h3 className={cn('font-semibold text-foreground', titleSizeStyles[size])}>{title}</h3>
        {description && (
          <p className={cn('text-muted-foreground max-w-md', descriptionSizeStyles[size])}>
            {description}
          </p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              'mt-4 inline-flex items-center justify-center',
              'rounded-md font-medium',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:pointer-events-none disabled:opacity-50',
              'h-9 px-4 text-sm',
              'transition-colors'
            )}
          >
            {action.label}
          </button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
