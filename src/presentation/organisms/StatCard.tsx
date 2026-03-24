/**
 * StatCard Component (Organism)
 * @description Enhanced metric card with progress bar and target tracking
 * Combines functionality of KPICard and StatsCard from main app
 */

import { forwardRef, type ComponentType } from 'react';
import { cn } from '../../infrastructure/utils';
import { Card, CardContent } from './Card';
import { Progress } from '../atoms';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { BaseProps, SizeVariant } from '../../domain/types';

export interface StatCardProps extends BaseProps {
  title: string;
  value: string | number;
  icon?: ComponentType<{ className?: string }>;
  iconColor?: string;
  trend?: {
    value: number;
    label?: string;
  };
  target?: {
    value: string;
    progress: number;
  };
  size?: Extract<SizeVariant, 'sm' | 'md' | 'lg'>;
  variant?: 'default' | 'gradient' | 'elevated';
  trendValueFormatter?: (value: number) => string;
  onClick?: () => void;
  changeLabel?: string; // For backward compatibility with StatsCard
}

const sizeStyles = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const valueSizeStyles = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
};

const iconSizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const labelSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const iconBgSizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      title,
      value,
      icon: Icon,
      iconColor = 'text-primary',
      trend,
      target,
      size = 'md',
      variant = 'default',
      trendValueFormatter = (v) => `${v > 0 ? '+' : ''}${Math.abs(v).toFixed(1)}%`,
      onClick,
      changeLabel,
      ...props
    },
    ref
  ) => {
    const isPositive = trend?.value !== undefined && trend.value >= 0;
    const GrowthIcon = isPositive ? ArrowUpRight : ArrowDownRight;
    const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
    const iconBgColor = isPositive ? 'text-green-500' : 'text-red-500';

    const cardVariant = variant === 'elevated' ? 'elevated' : 'default';

    return (
      <Card
        ref={ref}
        variant={cardVariant}
        className={cn(
          'transition-all duration-300',
          variant === 'gradient' && 'bg-gradient-to-br from-white to-gray-50 hover:shadow-lg border-0 shadow-md',
          onClick && 'cursor-pointer hover:shadow-lg hover:border-primary/50',
          className
        )}
        onClick={onClick}
        {...props}
      >
        <CardContent className={cn(sizeStyles[size])}>
          <div className="flex items-center justify-between mb-4">
            {Icon && (
              <div
                className={cn(
                  'rounded-xl flex items-center justify-center',
                  variant === 'gradient' && 'bg-gradient-to-br from-teal-500 to-cyan-500',
                  variant !== 'gradient' && `bg-${iconColor.split('-')[1]}-500/10`,
                  iconBgSizeStyles[size]
                )}
              >
                <Icon className={cn(iconSizeStyles[size], variant === 'gradient' ? 'text-white' : iconColor)} />
              </div>
            )}
            {trend && (
              <span
                className={cn(
                  'text-sm font-medium px-2 py-1 rounded-full',
                  isPositive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                )}
              >
                {changeLabel || trendValueFormatter(trend.value)}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className={cn('font-bold text-gray-900', valueSizeStyles[size])}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              <p className={cn('text-muted-foreground', labelSizeStyles[size])}>{title}</p>
            </div>

            {target && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Target: {target.value}</span>
                  <span className="text-teal-600">{target.progress}%</span>
                </div>
                <Progress value={target.progress} className="h-2" />
              </div>
            )}

            {trend && variant !== 'gradient' && (
              <div className="flex items-center mt-1">
                <GrowthIcon className={cn('h-3 w-3 mr-1', iconBgColor)} />
                <p className={cn('text-xs', trendColor)}>{trendValueFormatter(trend.value)}</p>
                {trend.label && <p className="text-xs text-muted-foreground ml-1">{trend.label}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

StatCard.displayName = 'StatCard';
