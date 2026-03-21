/**
 * Avatar Component (Molecule)
 * @description User avatar with fallback
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps, SizeVariant } from '../../domain/types';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: Extract<SizeVariant, 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>;
}

const sizeStyles: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string> = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-20 w-20 text-2xl',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const hasError = !src;

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {hasError ? (
          <span className="font-medium text-muted-foreground">
            {fallback || '?'}
          </span>
        ) : (
          <img src={src} alt={alt || 'Avatar'} className="h-full w-full object-cover" />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
