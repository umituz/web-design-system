import { forwardRef, type HTMLAttributes, type ElementType } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  asChild?: boolean;
  as?: ElementType;
}

const gapStyles: Record<StackGap, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
};

const alignStyles: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyStyles: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      gap = 'md',
      align = 'stretch',
      justify = 'start',
      wrap = false,
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
          'flex flex-col min-w-0',
          gapStyles[gap],
          alignStyles[align],
          justifyStyles[justify],
          wrap && 'flex-wrap',
          className
        )}
        {...props}
      />
    );
  }
);

Stack.displayName = 'Stack';
