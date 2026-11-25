
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../infrastructure/utils';
import type { BaseProps, ColorVariant } from '../../domain/types';
import type { MediumSizes } from '../../infrastructure/constants';

export type BadgeVariant = ColorVariant | 'info' | 'danger' | 'neutral' | 'accent' | 'violet' | 'outline' | 'surface';

/** Badge sizes; `xs` is the dense console chip (fixed 24px pill, 11.5px label). */
export type BadgeSize = MediumSizes | 'xs';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  variant?: BadgeVariant;
  tone?: BadgeVariant;
  icon?: ReactNode;
  size?: BadgeSize;
  small?: boolean;
  dot?: boolean;
  mono?: boolean;
  /** Render as the single child element (e.g. a router Link) instead of a div. */
  asChild?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary text-primary-foreground border-primary',
  info: 'bg-info text-info-foreground border-info',
  danger: 'bg-destructive text-destructive-foreground border-destructive',
  neutral: 'bg-secondary text-secondary-foreground border-secondary',
  accent: 'bg-primary text-primary-foreground border-primary',
  violet: 'bg-violet text-violet-foreground border-violet',
  secondary: 'bg-secondary text-secondary-foreground border-secondary',
  success: 'bg-success text-success-foreground border-success',
  warning: 'bg-warning text-warning-foreground border-warning',
  destructive: 'bg-destructive text-destructive-foreground border-destructive',
  outline: 'bg-transparent text-foreground border-border',
  surface: 'bg-card text-secondary-foreground border-input',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'h-6 gap-[5px] whitespace-nowrap px-[9px] text-[11.5px]',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, tone, icon, size, small = false, dot = false, mono = false, asChild = false, children, ...props }, ref) => {
    const resolvedVariant = variant ?? tone ?? 'primary';
    const resolvedSize = size ?? (small ? 'sm' : 'md');
    const classes = cn(
      'inline-flex items-center rounded-full border font-medium',
      variantStyles[resolvedVariant],
      sizeStyles[resolvedSize],
      mono && 'font-mono',
      className
    );
    if (asChild) {
      return (
        <Slot ref={ref} className={classes} {...props}>
          {children}
        </Slot>
      );
    }
    return (
      <div ref={ref} className={classes} {...props}>
        {dot && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />}
        {icon != null && <span aria-hidden="true" className="mr-1.5 inline-flex items-center [&_svg]:size-3">{icon}</span>}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
