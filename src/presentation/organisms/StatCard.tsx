/**
 * StatCard Component (Organism)
 * @description Enhanced metric card with progress bar and target tracking (Responsive)
 * Combines functionality of KPICard and StatsCard from main app
 */

import { forwardRef, type ComponentType } from 'react';
import { cn, getSpacing, getIconSize, getContainerSize, getTextSize, getSpaceY, getGap } from '../../infrastructure/utils';
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
  changeLabel?: string;
  responsiveLayout?: boolean;
}

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
      responsiveLayout = true,
      ...props
    },
    ref
  ) => {
    const isPositive = trend?.value !== undefined && trend.value >= 0;
    const GrowthIcon = isPositive ? ArrowUpRight : ArrowDownRight;
    const trendColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    const iconBgColor = isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';

    const cardVariant = variant === 'elevated' ? 'elevated' : 'default';

    return (
      <Card
        ref={ref}
        variant={cardVariant}
        className={cn(
          'transition-all duration-300',
          variant === 'gradient' && 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg border-0 shadow-md',
          onClick && 'cursor-pointer hover:shadow-lg hover:border-primary/50',
          className
        )}
        onClick={onClick}
        {...props}
      >
        <CardContent className={getSpacing('p', size)}>
          <div className={cn(
            'flex items-center justify-between mb-4',
            getGap('md'),
            'flex-col sm:flex-row sm:mb-6'
          )}>
            {Icon && (
              <div
                className={cn(
                  'rounded-xl flex items-center justify-center',
                  variant === 'gradient' && 'bg-gradient-to-br from-teal-500 to-cyan-500',
                  variant !== 'gradient' && `bg-${iconColor.split('-')[1]}-500/10`,
                  getContainerSize(size),
                  responsiveLayout && 'w-full sm:w-auto'
                )}
              >
                <Icon className={cn(getIconSize(size), variant === 'gradient' ? 'text-white' : iconColor)} />
              </div>
            )}
            {trend && (
              <span
                className={cn(
                  'text-xs sm:text-sm font-medium px-2 py-1 rounded-full whitespace-nowrap',
                  isPositive ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30' : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
                )}
              >
                {changeLabel || trendValueFormatter(trend.value)}
              </span>
            )}
          </div>

          <div className={getSpaceY('md')}>
            <div className={cn(
              responsiveLayout && 'text-center sm:text-left'
            )}>
              <p className={cn('font-bold text-gray-900 dark:text-gray-100', size === 'sm' ? 'text-lg sm:text-xl' : size === 'md' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl')}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              <p className={cn('text-muted-foreground', getTextSize(size))}>{title}</p>
            </div>

            {target && (
              <div className={getSpaceY('sm')}>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Target: {target.value}</span>
                  <span className="text-teal-600 dark:text-teal-400 font-medium">{target.progress}%</span>
                </div>
                <Progress value={target.progress} className="h-2 sm:h-2.5" />
              </div>
            )}

            {trend && variant !== 'gradient' && (
              <div className={cn(
                'flex items-center mt-1',
                responsiveLayout && 'justify-center sm:justify-start'
              )}>
                <GrowthIcon className={cn('h-3 w-3 sm:h-4 sm:w-4 mr-1', iconBgColor)} />
                <p className={cn('text-xs sm:text-sm', trendColor)}>{trendValueFormatter(trend.value)}</p>
                {trend.label && <p className="text-xs text-muted-foreground ml-1 hidden xs:inline">{trend.label}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

StatCard.displayName = 'StatCard';
