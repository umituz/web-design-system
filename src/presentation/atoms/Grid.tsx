import { forwardRef, type HTMLAttributes, type ElementType } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export type GridColsNumber = 1 | 2 | 3 | 4 | 5 | 6 | 12;

export interface ResponsiveGridCols {
  base?: GridColsNumber;
  sm?: GridColsNumber;
  md?: GridColsNumber;
  lg?: GridColsNumber;
  xl?: GridColsNumber;
}

export type GridCols = GridColsNumber | ResponsiveGridCols;
export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface GridProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  cols?: GridCols;
  gap?: GridGap;
  asChild?: boolean;
  as?: ElementType;
}

const gapStyles: Record<GridGap, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
};

const baseColStyles: Record<GridColsNumber, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const smColStyles: Record<GridColsNumber, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
  12: 'sm:grid-cols-12',
};

const mdColStyles: Record<GridColsNumber, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  12: 'md:grid-cols-12',
};

const lgColStyles: Record<GridColsNumber, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  12: 'lg:grid-cols-12',
};

const xlColStyles: Record<GridColsNumber, string> = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
  12: 'xl:grid-cols-12',
};

function resolveColClasses(cols: GridCols): string {
  if (typeof cols === 'number') {
    return baseColStyles[cols] ?? 'grid-cols-1';
  }

  const classes: string[] = [];
  if (cols.base) classes.push(baseColStyles[cols.base]);
  if (cols.sm) classes.push(smColStyles[cols.sm]);
  if (cols.md) classes.push(mdColStyles[cols.md]);
  if (cols.lg) classes.push(lgColStyles[cols.lg]);
  if (cols.xl) classes.push(xlColStyles[cols.xl]);

  return classes.length > 0 ? classes.join(' ') : 'grid-cols-1';
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      cols = 1,
      gap = 'md',
      asChild = false,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : Component;
    return (
      <Comp
        ref={ref}
        className={cn(
          'grid w-full min-w-0',
          resolveColClasses(cols),
          gapStyles[gap],
          className
        )}
        {...props}
      />
    );
  }
);

Grid.displayName = 'Grid';
