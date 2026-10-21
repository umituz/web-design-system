import { forwardRef, isValidElement } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { cn, getSpacing, getGap } from '../../infrastructure/utils';
import type { BaseProps, SizeVariant } from '../../domain/types';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

function isActionConfig(action: EmptyStateAction | ReactNode): action is EmptyStateAction {
  return (
    typeof action === 'object' &&
    action !== null &&
    !isValidElement(action) &&
    'label' in action &&
    'onClick' in action
  );
}

const FORWARD_REF = Symbol.for('react.forward_ref');
const MEMO = Symbol.for('react.memo');

function isComponentType(value: unknown): value is ComponentType<{ className?: string }> {
  if (typeof value === 'function') return true;
  if (typeof value !== 'object' || value === null) return false;
  const tag = (value as { $$typeof?: symbol }).$$typeof;
  return tag === FORWARD_REF || tag === MEMO;
}

export interface EmptyStateProps extends BaseProps {
  icon?: ComponentType<{ className?: string }> | ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction | ReactNode;
  size?: Extract<SizeVariant, 'sm' | 'md' | 'lg' | 'xl'>;
  centered?: boolean;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon,
      title,
      description,
      action,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const iconBox = size === 'sm' ? 'h-8 w-8 sm:h-10 sm:w-10' : size === 'md' ? 'h-12 w-12 sm:h-14 sm:w-14' : size === 'lg' ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-20 w-20 sm:h-24 sm:w-24';
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          getSpacing('p', size),
          getGap(size === 'xl' ? 'lg' : size),
          className
        )}
        {...props}
      >
        {isComponentType(icon) &&
          (() => {
            const Icon = icon;
            return (
              <Icon className={cn(iconBox, 'text-muted-foreground/50 mx-auto mb-2')} />
            );
          })()}
        {!isComponentType(icon) && icon && (
          <span
            className={cn(
              'inline-flex items-center justify-center text-muted-foreground/50 mx-auto mb-2',
              iconBox
            )}
          >
            {icon}
          </span>
        )}
        <h3 className={cn('font-semibold text-foreground', size === 'sm' ? 'text-sm sm:text-base' : size === 'md' ? 'text-base sm:text-lg' : size === 'lg' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl')}>{title}</h3>
        {description && (
          <p className={cn('text-muted-foreground max-w-md', size === 'sm' ? 'text-xs sm:text-sm' : size === 'md' ? 'text-sm sm:text-base' : size === 'lg' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl')}>
            {description}
          </p>
        )}
        {action &&
          (isActionConfig(action) ? (
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
          ) : (
            <div className="mt-4">{action}</div>
          ))}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
