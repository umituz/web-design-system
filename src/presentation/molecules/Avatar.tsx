/**
 * Avatar Component (Molecule)
 * @description User avatar with image and fallback (shadcn/ui compatible)
 */

import { forwardRef, type HTMLAttributes, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import type { ExtendedSizes } from '../../infrastructure/constants';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  name?: string;
  size?: ExtendedSizes;
}

const sizeStyles: Record<ExtendedSizes, string> = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-20 w-20 text-2xl',
};

const nameTones = [
  'bg-primary/15 text-primary',
  'bg-success/15 text-success',
  'bg-warning/15 text-warning',
  'bg-info/15 text-info',
  'bg-secondary text-secondary-foreground',
];

const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0] ?? '';
  const last = parts[parts.length - 1] ?? '';
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
};

const toneIndexOf = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997;
  }
  return hash % nameTones.length;
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', name, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {name !== undefined && !children ? (
          <AvatarFallback className={nameTones[toneIndexOf(name)]}>{initialsOf(name)}</AvatarFallback>
        ) : (
          children
        )}
      </div>
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

export type AvatarFallbackProps = HTMLAttributes<HTMLDivElement>;

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
