/**
 * Text Component (Atom)
 * @description Styled text element with polymorphic rendering
 */

import { forwardRef, memo, type ElementType, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export type TextElement = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
export type TextVariant = 'body' | 'heading' | 'label' | 'caption';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

type TextComponentProps = {
  as?: TextElement;
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
};

export type TextProps = TextComponentProps &
  Omit<ComponentPropsWithoutRef<'p'>, keyof TextComponentProps> &
  BaseProps;

const variantStyles: Record<TextVariant, string> = {
  body: 'text-foreground',
  heading: 'text-foreground font-semibold',
  label: 'text-foreground font-medium',
  caption: 'text-muted-foreground',
};

const sizeStyles: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

const weightStyles: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const Text = memo(forwardRef<HTMLElement, TextProps>(
  ({ className, as: Tag = 'p', variant = 'body', size = 'md', weight = 'normal', ...props }, ref) => {
    const Element = Tag as ElementType;
    return (
      <Element
        ref={ref}
        className={cn(
          variantStyles[variant],
          sizeStyles[size],
          weightStyles[weight],
          className
        )}
        {...props}
      />
    );
  }
));

Text.displayName = 'Text';
