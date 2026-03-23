/**
 * PageLayout Template Component
 * @description Centralized page layout with consistent padding, max-width, and theme integration
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import type { BaseProps, ChildrenProps } from '../../domain/types';

export type MaxWidth = '4xl' | '7xl' | 'full';

export interface PageLayoutProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  maxWidth?: MaxWidth;
}

const maxWidthClasses: Record<MaxWidth, string> = {
  '4xl': 'max-w-4xl',
  '7xl': 'max-w-7xl',
  'full': 'max-w-full',
};

export const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ children, maxWidth = '7xl', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="min-h-screen bg-surface-gradient py-8 md:py-12 px-4 transition-theme"
        {...props}
      >
        <div className={cn(maxWidthClasses[maxWidth], 'mx-auto', className)}>
          {children}
        </div>
      </div>
    );
  }
);

PageLayout.displayName = 'PageLayout';
