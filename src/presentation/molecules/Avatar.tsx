
import { forwardRef, type HTMLAttributes, type ComponentPropsWithoutRef } from 'react';
import { BadgeCheck } from 'lucide-react';
import { cn, initialsOf } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import type { ExtendedSizes } from '../../infrastructure/constants';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  name?: string;
  size?: ExtendedSizes;
  hue?: number;
  verified?: boolean;
  live?: boolean;
}

const sizeStyles: Record<ExtendedSizes, string> = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-20 w-20 text-2xl',
};

const verifiedSizes: Record<ExtendedSizes, string> = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
  '2xl': 'h-7 w-7',
};

const nameTones = [
  'bg-primary/15 text-primary',
  'bg-success/15 text-success',
  'bg-warning/15 text-warning',
  'bg-info/15 text-info',
  'bg-secondary text-secondary-foreground',
];

const toneIndexOf = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997;
  }
  return hash % nameTones.length;
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', name, hue, verified = false, live = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 rounded-full',
          live && 'ring-2 ring-destructive ring-offset-2 ring-offset-background',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {name !== undefined && !children ? (
          hue !== undefined ? (
            <AvatarFallback
              className="font-medium"
              style={{ backgroundColor: `hsl(${hue} 42% 88%)`, color: `hsl(${hue} 45% 30%)` }}
            >
              {initialsOf(name)}
            </AvatarFallback>
          ) : (
            <AvatarFallback className={nameTones[toneIndexOf(name)]}>{initialsOf(name)}</AvatarFallback>
          )
        ) : (
          children
        )}
        {verified && (
          <span
            aria-hidden="true"
            className={cn(
              'absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-px',
              verifiedSizes[size],
            )}
          >
            <BadgeCheck className="h-full w-full text-info" />
          </span>
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
        className={cn('aspect-square h-full w-full rounded-full object-cover', className)}
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
          'flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-muted',
          className
        )}
        {...props}
      />
    );
  }
);

AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
