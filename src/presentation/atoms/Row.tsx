import { forwardRef, type HTMLAttributes, type ElementType } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export type RowGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type RowAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type RowJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface RowProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  gap?: RowGap;
  align?: RowAlign;
  justify?: RowJustify;
  wrap?: boolean;
  inline?: boolean;
  asChild?: boolean;
  as?: ElementType;
}

const gapStyles: Record<RowGap, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
};

const alignStyles: Record<RowAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyStyles: Record<RowJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export const Row = forwardRef<HTMLDivElement, RowProps>(
  (
    {
      className,
      gap = 'sm',
      align = 'center',
      justify = 'start',
      wrap = false,
      inline = false,
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
          inline ? 'inline-flex' : 'flex',
          'flex-row min-w-0',
          gapStyles[gap],
          alignStyles[align],
          justifyStyles[justify],
          wrap ? 'flex-wrap' : 'flex-nowrap',
          className
        )}
        {...props}
      />
    );
  }
);

Row.displayName = 'Row';
