/**
 * MetricCard Component (Organism)
 * @description Card component for displaying metrics and statistics with trend indicators
 */

import { forwardRef, type ComponentProps } from 'react';
import { cn } from '../../infrastructure/utils/cn';
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
}

const sizeStyles = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

const valueSizeStyles = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
};

const iconSizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

const labelSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

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
        <CardContent className={cn(sizeStyles[size])}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className={cn('text-muted-foreground font-medium', labelSizeStyles[size])}>{title}</p>
              <p className={cn('font-bold text-foreground', valueSizeStyles[size])}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              {trend && (
                <div className="flex items-center gap-1 mt-1">
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isPositive ? colors.positive : colors.negative
                    )}
                  >
                    {TrendIcon}
                  </span>
                  <p className={cn('text-xs', isPositive ? colors.positive : colors.negative)}>
                    {trendValueFormatter(trend.value)}
                  </p>
                  {trend.label && (
                    <p className="text-xs text-muted-foreground ml-1">{trend.label}</p>
                  )}
                </div>
              )}
            </div>
            {Icon && (
              <Icon className={cn(iconSizeStyles[size], iconColor, 'flex-shrink-0')} />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

MetricCard.displayName = 'MetricCard';
