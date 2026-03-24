/**
 * MetricCard Component (Organism)
 * @description Card component for displaying metrics and statistics with trend indicators (Responsive)
 */

import { forwardRef } from 'react';
import { cn, getSpacing, getIconSize, getTextSize, getGap } from '../../infrastructure/utils';
import { Card, CardContent } from './Card';
import type { BaseProps, ColorVariant, SizeVariant } from '../../domain/types';

export interface MetricCardProps extends BaseProps {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  trend?: {
    value: number;
    label?: string;
  };
  size?: Extract<SizeVariant, 'sm' | 'md' | 'lg'>;
  variant?: ColorVariant;
  trendValueFormatter?: (value: number) => string;
  onClick?: () => void;
  responsiveLayout?: boolean; // Enable responsive layout changes
}

const trendColors: Record<ColorVariant, { positive: string; negative: string; bg: string }> = {
  primary: { positive: 'text-primary', negative: 'text-destructive', bg: 'bg-primary' },
  secondary: { positive: 'text-secondary', negative: 'text-destructive', bg: 'bg-secondary' },
  success: { positive: 'text-success', negative: 'text-destructive', bg: 'bg-success' },
  warning: { positive: 'text-warning', negative: 'text-destructive', bg: 'bg-warning' },
  destructive: { positive: 'text-destructive', negative: 'text-success', bg: 'bg-destructive' },
};

export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      className,
      title,
      value,
      icon: Icon,
      iconColor = 'text-primary',
      trend,
      size = 'md',
      variant = 'primary',
      trendValueFormatter = (v) => `${v > 0 ? '+' : ''}${v}%`,
      onClick,
      responsiveLayout = true,
      ...props
    },
    ref
  ) => {
    const isPositive = trend?.value !== undefined && trend.value >= 0;
    const TrendIcon = isPositive ? '↑' : '↓';
    const colors = trendColors[variant];

    return (
      <Card
        ref={ref}
        className={cn(
          'transition-all duration-200',
          onClick && 'cursor-pointer hover:shadow-md hover:border-primary/50',
          className
        )}
        onClick={onClick}
        {...props}
      >
        <CardContent className={getSpacing('p', size)}>
          <div className={cn(
            'flex items-center justify-between',
            getGap('md'),
            responsiveLayout && 'flex-col sm:flex-row'
          )}>
            <div className={cn(
              'flex-1',
              responsiveLayout && 'text-center sm:text-left w-full sm:w-auto'
            )}>
              <p className={cn('text-muted-foreground font-medium', getTextSize(size))}>{title}</p>
              <p className={cn('font-bold text-foreground mt-1', size === 'sm' ? 'text-lg sm:text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl sm:text-4xl')}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              {trend && (
                <div className={cn(
                  'flex items-center gap-1 mt-1',
                  responsiveLayout ? 'justify-center sm:justify-start' : ''
                )}>
                  <span
                    className={cn(
                      'text-xs sm:text-sm font-medium',
                      isPositive ? colors.positive : colors.negative
                    )}
                  >
                    {TrendIcon}
                  </span>
                  <p className={cn('text-xs sm:text-sm', isPositive ? colors.positive : colors.negative)}>
                    {trendValueFormatter(trend.value)}
                  </p>
                  {trend.label && (
                    <p className="text-xs text-muted-foreground ml-1 hidden sm:inline">{trend.label}</p>
                  )}
                </div>
              )}
            </div>
            {Icon && (
              <div className={cn(
                responsiveLayout ? 'sm:self-auto' : ''
              )}>
                <Icon className={cn(getIconSize(size), iconColor, 'flex-shrink-0')} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

MetricCard.displayName = 'MetricCard';
