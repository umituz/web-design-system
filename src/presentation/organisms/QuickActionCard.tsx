/**
 * QuickActionCard Component (Organism)
 * @description Card component for quick navigation actions with icon
 */

import { forwardRef } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import type { BaseProps, SizeVariant } from '../../domain/types';

export interface QuickActionCardProps extends BaseProps {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBgColor?: string;
  onClick?: () => void;
  href?: string;
  size?: Extract<SizeVariant, 'sm' | 'md' | 'lg'>;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

const sizeStyles = {
  sm: 'p-3 gap-2',
  md: 'p-4 gap-3',
  lg: 'p-5 gap-4',
};

const iconSizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconInnerSizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const labelSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const QuickActionCard = forwardRef<HTMLAnchorElement | HTMLDivElement, QuickActionCardProps>(
  (
    {
      className,
      label,
      icon: Icon,
      iconColor = 'text-white',
      iconBgColor = 'bg-primary',
      onClick,
      href,
      size = 'md',
      target = '_self',
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        {Icon && (
          <div className={cn(iconSizeStyles[size], 'rounded-lg flex items-center justify-center flex-shrink-0', iconBgColor)}>
            <Icon className={cn(iconInnerSizeStyles[size], iconColor)} />
          </div>
        )}
        <span className={cn('font-medium text-foreground group-hover:text-primary transition-colors', labelSizeStyles[size])}>
          {label}
        </span>
      </>
    );

    const baseClasses = cn(
      'bg-card border border-border rounded-xl',
      'flex items-center',
      'hover:border-primary/50 transition-colors group',
      sizeStyles[size],
      className
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          className={baseClasses}
          onClick={onClick}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={baseClasses}
        onClick={onClick}
        {...props}
      >
        {content}
      </div>
    );
  }
);

QuickActionCard.displayName = 'QuickActionCard';
