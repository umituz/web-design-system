import * as React from 'react';
import { Card } from './Card';
import { Skeleton } from '../atoms/Skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../infrastructure/utils';

export interface StatItem {
  id?: string;
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
}

export interface StatsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  loading?: boolean;
}

const colStyles = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export const StatsGrid = React.forwardRef<HTMLDivElement, StatsGridProps>(
  ({ stats, columns = 4, loading = false, className, ...props }, ref) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn('grid gap-4 w-full', colStyles[columns], className)}
          {...props}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <Card key={i} className="p-5 flex flex-col gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-40" />
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('grid gap-4 w-full', colStyles[columns], className)}
        {...props}
      >
        {stats.map((stat, idx) => {
          const isUp = stat.trend === 'up';
          const isDown = stat.trend === 'down';

          return (
            <Card
              key={stat.id ?? idx}
              className="p-5 flex flex-col justify-between transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-muted-foreground truncate">
                  {stat.title}
                </span>
                {stat.icon && (
                  <div className="size-9 rounded-lg bg-accent/60 flex items-center justify-center text-foreground shrink-0 [&_svg]:size-4">
                    {stat.icon}
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-2">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </div>

                {stat.change && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
                      isUp && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                      isDown && 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                      !isUp && !isDown && 'bg-accent text-muted-foreground'
                    )}
                  >
                    {isUp && <TrendingUp className="size-3" />}
                    {isDown && <TrendingDown className="size-3" />}
                    {!isUp && !isDown && <Minus className="size-3" />}
                    <span>{stat.change}</span>
                  </span>
                )}
              </div>

              {stat.description && (
                <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
                  {stat.description}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    );
  }
);

StatsGrid.displayName = 'StatsGrid';
