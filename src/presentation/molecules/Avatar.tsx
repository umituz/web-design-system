/**
 * Avatar Component (Molecule)
 * @description User avatar with image and fallback (shadcn/ui compatible)
 */

import { forwardRef, type HTMLAttributes, type ElementType, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import type { BaseProps, SizeVariant } from '../../domain/types';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
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

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full',
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarImageProps extends ComponentPropsWithoutRef<'img'> {
  asChild?: boolean;
}

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn('aspect-square h-full w-full object-cover', className)}
        {...props}
      />
    );
  }
);

AvatarImage.displayName = 'AvatarImage';

export interface AvatarFallbackProps extends HTMLAttributes<HTMLDivElement> {}

const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-muted',
          className
        )}
        {...props}
      />
    );
  }
);

AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
