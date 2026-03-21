/**
 * Text Component (Atom)
 * @description Styled text element
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export type TextElement = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type TextVariant = 'body' | 'heading' | 'label' | 'caption';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export interface TextProps extends HTMLAttributes<HTMLElement>, BaseProps {
  as?: TextElement;
  variant?: TextVariant;
  size?: TextSize;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

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

const weightStyles: Record<'normal' | 'medium' | 'semibold' | 'bold', string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ className, as = 'p', variant = 'body', size = 'md', weight = 'normal', ...props }, ref) => {
    const Tag = as as any;
    return (
      <Tag
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
);

Text.displayName = 'Text';
