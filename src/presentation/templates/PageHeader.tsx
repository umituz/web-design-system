/**
 * PageHeader Template Component
 * @description Centralized page header with consistent heading styling
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import type { BaseProps } from '../../domain/types';

export type TextAlign = 'left' | 'center' | 'right';
export type HeaderSize = 'small' | 'medium' | 'large';

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, BaseProps {
  title: ReactNode;
  subtitle?: string;
  align?: TextAlign;
  size?: HeaderSize;
  actions?: ReactNode;
}

const sizeClasses: Record<HeaderSize, { title: string; subtitle: string }> = {
  small: {
    title: 'text-2xl md:text-3xl font-bold',
    subtitle: 'text-base md:text-lg',
  },
  medium: {
    title: 'text-3xl md:text-4xl font-bold',
    subtitle: 'text-lg md:text-xl',
  },
  large: {
    title: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    subtitle: 'text-lg md:text-xl',
  },
};

const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const getAlignFlexClass = (align: TextAlign, hasActions: boolean): string => {
  if (!hasActions) return '';
  return align === 'center'
    ? 'flex justify-center'
    : align === 'right'
      ? 'flex justify-end'
      : 'flex justify-start';
};

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, subtitle, align = 'center', size = 'large', actions, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-6 md:mb-12', alignClasses[align], className)}
        {...props}
      >
        <h1 className={cn(sizeClasses[size].title, 'text-text-primary mb-4')}>
          {title}
        </h1>
        {subtitle && (
          <p className={cn(sizeClasses[size].subtitle, 'text-text-secondary')}>
            {subtitle}
          </p>
        )}
        {actions && (
          <div className={cn('mt-6 md:mt-8', getAlignFlexClass(align, true))}>
            {actions}
          </div>
        )}
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';
