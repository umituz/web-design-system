/**
 * Grid Component (Organism)
 * @description Responsive grid system with configurable columns
 */

import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface GridProps extends BaseProps {
  children: React.ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number | string;
  className?: string;
}

/**
 * Responsive grid system that adjusts columns based on breakpoint
 * @param cols - Number of columns per breakpoint
 * @param gap - Gap between items (spacing unit or custom value)
 * @param children - Grid items
 *
 * @example
 * ```tsx
 * // Auto responsive: 1 col mobile, 2 tablet, 3 desktop
 * <Grid cols={{ xs: 1, sm: 2, lg: 3 }}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Grid>
 *
 * // Fixed 4 columns
 * <Grid cols={{ lg: 4 }}>
 *   {items.map(item => <Card key={item.id}>{item}</Card>)}
 * </Grid>
 * ```
 */
export const Grid = ({ children, cols = {}, gap = 4, className }: GridProps) => {
  const {
    xs = 1,
    sm = xs,
    md = sm,
    lg = md,
    xl = lg,
    '2xl': xl2 = xl
  } = cols;

  const gridCols = cn(
    'grid',
    `grid-cols-${xs}`, // xs always applies (mobile-first)
    sm !== xs && `sm:grid-cols-${sm}`,
    md !== sm && `md:grid-cols-${md}`,
    lg !== md && `lg:grid-cols-${lg}`,
    xl !== lg && `xl:grid-cols-${xl}`,
    xl2 !== xl && `2xl:grid-cols-${xl2}`
  );

  const gapClass = typeof gap === 'number' ? `gap-${gap}` : gap;

  return (
    <div className={cn(gridCols, gapClass, className)}>
      {children}
    </div>
  );
};

Grid.displayName = 'Grid';

/**
 * Grid Item component for custom column spans
 */
export interface GridItemProps extends BaseProps {
  children: React.ReactNode;
  span?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  className?: string;
}

/**
 * Grid item with custom column span per breakpoint
 * @param span - Number of columns to span (1-12)
 *
 * @example
 * ```tsx
 * <Grid cols={{ lg: 4 }}>
 *   <GridItem span={{ lg: 2 }}>Spans 2 columns</GridItem>
 *   <GridItem>Regular 1 column</GridItem>
 * </Grid>
 * ```
 */
export const GridItem = ({ children, span = {}, className }: GridItemProps) => {
  const {
    xs = 1,
    sm = xs,
    md = sm,
    lg = md,
    xl = lg,
    '2xl': xl2 = xl
  } = span;

  const colSpan = cn(
    'col-span-1',
    `sm:col-span-${sm}`,
    `md:col-span-${md}`,
    `lg:col-span-${lg}`,
    `xl:col-span-${xl}`,
    `2xl:col-span-${xl2}`
  );

  return (
    <div className={cn(colSpan, className)}>
      {children}
    </div>
  );
};

GridItem.displayName = 'GridItem';
