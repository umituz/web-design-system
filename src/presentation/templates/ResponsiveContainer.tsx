/**
 * ResponsiveContainer Template Component
 * @description Responsive wrapper with mobile/desktop optimizations
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import { useBreakpoint } from '../hooks/useMediaQuery';
import type { BaseProps, ChildrenProps } from '../../domain/types';

export type ResponsiveSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ResponsiveContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    BaseProps,
    ChildrenProps {
  /**
   * Maximum width on mobile devices
   * @default 'full'
   */
  mobileMaxWidth?: ResponsiveSize;

  /**
   * Maximum width on tablet devices
   * @default 'lg'
   */
  tabletMaxWidth?: ResponsiveSize;

  /**
   * Maximum width on desktop devices
   * @default 'xl'
   */
  desktopMaxWidth?: ResponsiveSize;

  /**
   * Padding on mobile devices
   * @default true
   */
  mobilePadding?: boolean;

  /**
   * Padding on tablet devices
   * @default true
   */
  tabletPadding?: boolean;

  /**
   * Padding on desktop devices
   * @default true
   */
  desktopPadding?: boolean;

  /**
   * Center content horizontally
   * @default true
   */
  centered?: boolean;

  /**
   * Background gradient
   * @default false
   */
  gradient?: boolean;

  /**
   * Minimum height
   * @default 'auto'
   */
  minHeight?: 'auto' | 'screen' | 'full';
}

const maxWidthClasses: Record<ResponsiveSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
};

const sizeBreakpointMap: Record<string, ResponsiveSize> = {
  sm: 'mobileMaxWidth',
  md: 'tabletMaxWidth',
  lg: 'desktopMaxWidth',
};

export const ResponsiveContainer = forwardRef<
  HTMLDivElement,
  ResponsiveContainerProps
>(
  (
    {
      children,
      mobileMaxWidth = 'full',
      tabletMaxWidth = 'lg',
      desktopMaxWidth = 'xl',
      mobilePadding = true,
      tabletPadding = true,
      desktopPadding = true,
      centered = true,
      gradient = false,
      minHeight = 'auto',
      className,
      ...props
    },
    ref
  ) => {
    const breakpoint = useBreakpoint();

    // Determine current max width based on breakpoint
    const getCurrentMaxWidth = (): string => {
      if (!breakpoint) return maxWidthClasses[mobileMaxWidth];

      if (breakpoint === 'sm') {
        return maxWidthClasses[mobileMaxWidth];
      }
      if (breakpoint === 'md') {
        return maxWidthClasses[tabletMaxWidth];
      }
      return maxWidthClasses[desktopMaxWidth];
    };

    // Determine current padding based on breakpoint
    const getCurrentPadding = (): string => {
      if (!breakpoint) return mobilePadding ? 'px-4' : '';

      if (breakpoint === 'sm') {
        return mobilePadding ? 'px-4' : '';
      }
      if (breakpoint === 'md') {
        return tabletPadding ? 'px-6' : '';
      }
      return desktopPadding ? 'px-8' : '';
    };

    // Determine current py padding based on breakpoint
    const getCurrentPyPadding = (): string => {
      if (!breakpoint) return 'py-8';

      if (breakpoint === 'sm') {
        return 'py-8';
      }
      if (breakpoint === 'md') {
        return 'py-12';
      }
      return 'py-16';
    };

    const minHeightClasses: Record<
      typeof minHeight,
      string
    > = {
      auto: '',
      screen: 'min-h-screen',
      full: 'min-h-full',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'transition-theme',
          gradient && 'bg-surface-gradient',
          minHeightClasses[minHeight],
          getCurrentPyPadding(),
          getCurrentPadding(),
          centered && 'mx-auto',
          getCurrentMaxWidth(),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveContainer.displayName = 'ResponsiveContainer';
