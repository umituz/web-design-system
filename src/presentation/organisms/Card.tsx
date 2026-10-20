/**
 * Card Component (Organism)
 * @description Content container with header, body, footer
 */

import { forwardRef, type HTMLAttributes } from 'react';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface CardProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  variant?: 'default' | 'outlined' | 'elevated';
  /** Render as the single child element (e.g. a router Link) instead of a div. */
  asChild?: boolean;
  /** Interactive card: pointer cursor, hover border and a visible focus ring. */
  interactive?: boolean;
}

const variantStyles: Record<'default' | 'outlined' | 'elevated', string> = {
  default: 'border border-border bg-card text-card-foreground',
  outlined: 'border-2 border-border bg-transparent',
  elevated: 'border-0 shadow-lg bg-card text-card-foreground',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', asChild = false, interactive = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        className={cn(
          'rounded-lg text-left',
          variantStyles[variant],
          interactive &&
            'cursor-pointer transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends Omit<CardProps, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  bordered?: boolean;
}

export const CardHeader = React.memo(forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, eyebrow, icon, actions, bordered = false, children, ...props }, ref) => {
    const hasStructuralProps =
      title !== undefined || subtitle !== undefined || actions !== undefined || eyebrow !== undefined || icon !== undefined;
    if (!hasStructuralProps) {
      return (
        <div
          ref={ref}
          className={cn('flex flex-col space-y-1.5 p-6', bordered && 'border-b border-border', className)}
          {...props}
        >
          {children}
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between gap-4 p-6', bordered && 'border-b border-border', className)}
        {...props}
      >
        <div className="flex min-w-0 flex-col space-y-1.5">
          {eyebrow !== undefined && (
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{eyebrow}</p>
          )}
          {title !== undefined && (
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle>{title}</CardTitle>
            </div>
          )}
          {subtitle !== undefined && <CardDescription>{subtitle}</CardDescription>}
          {children}
        </div>
        {actions !== undefined && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    );
  }
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.memo(forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.memo(forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
));

CardDescription.displayName = 'CardDescription';

export const CardContent = React.memo(forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.memo(forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
));

CardFooter.displayName = 'CardFooter';
