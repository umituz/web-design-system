import { forwardRef } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';
import { cn, getSpacing, getGap } from '../../infrastructure/utils';
import type { BaseProps, SizeVariant } from '../../domain/types';
import { Button } from '../atoms/Button';
import { isActionConfig, isComponentType } from './EmptyState';
import type { EmptyStateAction } from './EmptyState';
import { useConsoleLabels } from '../page-kit/console-labels';

export interface ErrorStateProps extends BaseProps {
  icon?: ComponentType<{ className?: string }> | ReactNode;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  onBack?: () => void;
  backLabel?: string;
  action?: EmptyStateAction | ReactNode;
  size?: Extract<SizeVariant, 'sm' | 'md' | 'lg'>;
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      className,
      icon,
      title,
      description,
      onRetry,
      retryLabel,
      onBack,
      backLabel,
      action,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const consoleLabels = useConsoleLabels();
    const preset = title === undefined;
    const resolvedTitle = title ?? consoleLabels.errorState.title;
    const resolvedDescription = preset ? (description ?? consoleLabels.errorState.description) : description;
    const resolvedRetryLabel = retryLabel ?? consoleLabels.errorState.retry;
    const resolvedBackLabel = backLabel ?? consoleLabels.errorState.back;
    const iconBox = size === 'sm' ? 'h-8 w-8 sm:h-10 sm:w-10' : size === 'md' ? 'h-12 w-12 sm:h-14 sm:w-14' : 'h-16 w-16 sm:h-20 sm:w-20';
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex flex-col items-center justify-center text-center',
          getSpacing('p', size),
          getGap(size),
          className
        )}
        {...props}
      >
        {(() => {
          if (icon) {
            if (isComponentType(icon)) {
              const Icon = icon;
              return (
                <Icon className={cn(iconBox, 'text-destructive/60 mx-auto mb-2')} />
              );
            }
            return (
              <span
                className={cn(
                  'inline-flex items-center justify-center text-destructive/60 mx-auto mb-2',
                  iconBox
                )}
              >
                {icon}
              </span>
            );
          }
          const Icon = CircleAlert;
          return <Icon className={cn(iconBox, 'text-destructive/60 mx-auto mb-2')} />;
        })()}
        <h3 className={cn('font-semibold text-foreground', size === 'sm' ? 'text-sm sm:text-base' : size === 'md' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl')}>{resolvedTitle}</h3>
        {resolvedDescription && (
          <p className={cn('text-muted-foreground max-w-md', size === 'sm' ? 'text-xs sm:text-sm' : size === 'md' ? 'text-sm sm:text-base' : 'text-base sm:text-lg')}>
            {resolvedDescription}
          </p>
        )}
        {(onRetry || onBack || action) && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {onRetry && (
              <Button size="sm" onClick={onRetry}>
                {resolvedRetryLabel}
              </Button>
            )}
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                {resolvedBackLabel}
              </Button>
            )}
            {action &&
              (isActionConfig(action) ? (
                <Button variant="outline" size="sm" onClick={action.onClick}>
                  {action.label}
                </Button>
              ) : (
                action
              ))}
          </div>
        )}
      </div>
    );
  }
);

ErrorState.displayName = 'ErrorState';
