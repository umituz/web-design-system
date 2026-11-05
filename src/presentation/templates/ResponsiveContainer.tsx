
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import { useBreakpoint } from '../hooks/useMediaQuery';
import type { BaseProps } from '../../domain/types';

export type ResponsiveSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ResponsiveContainerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    BaseProps {
  children?: ReactNode;
  mobileMaxWidth?: ResponsiveSize;

  tabletMaxWidth?: ResponsiveSize;

  desktopMaxWidth?: ResponsiveSize;

  mobilePadding?: boolean;

  tabletPadding?: boolean;

  desktopPadding?: boolean;

  centered?: boolean;

  gradient?: boolean;

  minHeight?: 'auto' | 'screen' | 'full';
}

const maxWidthClasses: Record<ResponsiveSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
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
    const { currentBreakpoint: breakpoint } = useBreakpoint();

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
