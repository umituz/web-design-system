/**
 * Navbar Component (Organism)
 * @description Navigation bar with logo and links
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps, ChildrenProps } from '../../domain/types';

export interface NavbarProps extends HTMLAttributes<HTMLElement>, BaseProps {
  variant?: 'default' | 'sticky' | 'fixed';
}

const variantStyles: Record<'default' | 'sticky' | 'fixed', string> = {
  default: 'relative',
  sticky: 'sticky top-0 z-50',
  fixed: 'fixed top-0 left-0 right-0 z-50',
};

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          'flex h-16 items-center gap-4 border-b border-border/40 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </nav>
    );
  }
);

Navbar.displayName = 'Navbar';

export const NavbarBrand = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-2 font-bold text-lg', className)}
      {...props}
    />
  )
);

NavbarBrand.displayName = 'NavbarBrand';

export const NavbarLinks = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('hidden items-center gap-6 md:flex', className)}
      {...props}
    />
  )
);

NavbarLinks.displayName = 'NavbarLinks';

export const NavbarActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('ml-auto flex items-center gap-2', className)}
      {...props}
    />
  )
);

NavbarActions.displayName = 'NavbarActions';
