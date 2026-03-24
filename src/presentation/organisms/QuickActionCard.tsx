/**
 * QuickActionCard Component (Organism)
 * @description Card component for quick navigation actions with icon (Responsive)
 */

import { forwardRef } from 'react';
import { cn, getSpacing, getIconSize, getContainerSize, getTextSize, getGap } from '../../infrastructure/utils';
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
  responsiveLayout?: boolean; // Enable responsive layout changes
}

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
      responsiveLayout = true,
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        {Icon && (
          <div className={cn(getContainerSize(size), 'rounded-lg flex items-center justify-center flex-shrink-0', iconBgColor)}>
            <Icon className={cn(getIconSize(size), iconColor)} />
          </div>
        )}
        <span className={cn(
          'font-medium text-foreground group-hover:text-primary transition-colors',
          getTextSize(size),
          responsiveLayout && 'text-center sm:text-left'
        )}>
          {label}
        </span>
      </>
    );

    const baseClasses = cn(
      'bg-card border border-border rounded-xl',
      responsiveLayout ? 'flex flex-col sm:flex-row items-center justify-center sm:justify-start' : 'flex items-center',
      'hover:border-primary/50 hover:shadow-md transition-all duration-200 group',
      getSpacing('p', size),
      getGap(size === 'sm' ? 'sm' : size),
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
