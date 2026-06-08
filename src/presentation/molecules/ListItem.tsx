/**
 * ListItem Component (Molecule)
 * @description Reusable list item with icon, content, and actions
 */

import { forwardRef, type ReactNode, type MouseEvent } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface ListItemProps extends Omit<BaseProps, 'id'> {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  href?: string;
  disabled?: boolean;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'ghost';
  id?: string;
}

const sizeStyles = {
  sm: 'p-3 gap-3',
  md: 'p-4 gap-4',
  lg: 'p-5 gap-5',
} as const;

const titleSizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
} as const;

const descriptionSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
} as const;

const iconSizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const;

export const ListItem = forwardRef<HTMLElement, ListItemProps>(
  (
    {
      className,
      title,
      description,
      icon,
      actions,
      leftContent,
      rightContent,
      onClick,
      href,
      disabled = false,
      selected = false,
      size = 'md',
      variant = 'default',
      id,
    },
    ref
  ) => {
    const baseClasses = cn(
      'flex w-full items-center justify-between transition-all duration-200',
      sizeStyles[size],
      !disabled && onClick && 'cursor-pointer hover:bg-muted/50 active:scale-[0.98]',
      selected && 'border-primary bg-muted/50',
      variant === 'bordered' && 'rounded-lg border border-border',
      variant === 'ghost' && 'hover:bg-muted/30',
      disabled && 'cursor-not-allowed opacity-50',
      className
    );

    const content = (
      <>
        {(leftContent || icon) && (
          <div className="flex shrink-0 items-center gap-3">
            {icon ? (
              <div className={cn(iconSizeStyles[size], 'text-muted-foreground')}>{icon}</div>
            ) : (
              leftContent
            )}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className={cn('truncate font-medium text-foreground', titleSizeStyles[size])}>
            {title}
          </p>
          {description && (
            <p className={cn('truncate text-muted-foreground', descriptionSizeStyles[size])}>
              {description}
            </p>
          )}
        </div>

        {(rightContent || actions) && (
          <div className="flex shrink-0 items-center gap-2">
            {rightContent}
            {actions}
          </div>
        )}
      </>
    );

    if (href && !disabled) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={baseClasses}
          id={id}
          onClick={onClick}
        >
          {content}
        </a>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={baseClasses}
        onClick={disabled ? undefined : onClick}
        id={id}
        role={onClick && !disabled ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
      >
        {content}
      </div>
    );
  }
);

ListItem.displayName = 'ListItem';
