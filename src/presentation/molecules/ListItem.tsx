/**
 * ListItem Component (Molecule)
 * @description Reusable list item with icon, content, and actions
 * Reduces boilerplate in list components throughout the app
 */

import { forwardRef, type ReactNode, type MouseEvent } from 'react';
import { cn } from '../../infrastructure/utils';
import { Button } from '../atoms';
import type { BaseProps } from '../../domain/types';

export interface ListItemProps extends BaseProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'ghost';
}

const sizeStyles = {
  sm: 'p-3 gap-3',
  md: 'p-4 gap-4',
  lg: 'p-5 gap-5',
};

const titleSizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const descriptionSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const iconSizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
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
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      'flex items-center justify-between w-full transition-all duration-200',
      sizeStyles[size],
      !disabled && onClick && 'cursor-pointer hover:bg-muted/50 active:scale-[0.98]',
      selected && 'bg-muted/50 border-primary',
      variant === 'bordered' && 'border border-border rounded-lg',
      variant === 'ghost' && 'hover:bg-muted/30',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    );

    const content = (
      <>
        {leftContent || icon ? (
          <div className="flex items-center gap-3 flex-shrink-0">
            {icon && <div className={cn(iconSizeStyles[size], 'text-muted-foreground')}>{icon}</div>}
            {!icon && leftContent}
          </div>
        ) : null}

        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-foreground truncate', titleSizeStyles[size])}>{title}</p>
          {description && (
            <p className={cn('text-muted-foreground truncate', descriptionSizeStyles[size])}>{description}</p>
          )}
        </div>

        {rightContent || actions ? (
          <div className="flex items-center gap-2 flex-shrink-0">
            {rightContent}
            {actions}
          </div>
        ) : null}
      </>
    );

    if (href && !disabled) {
      return (
        <a href={href} ref={ref as any} className={baseClasses} {...(props as any)}>
          {content}
        </a>
      );
    }

    return (
      <div
        ref={ref}
        className={baseClasses}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {content}
      </div>
    );
  }
);

ListItem.displayName = 'ListItem';
