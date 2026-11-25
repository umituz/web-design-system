import { forwardRef, useContext, createContext, type HTMLAttributes } from 'react';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export type CardDensity = 'default' | 'compact';

const CardDensityContext = createContext<CardDensity>('default');

export interface CardProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  variant?: 'default' | 'outlined' | 'elevated';
  density?: CardDensity;
  asChild?: boolean;
  interactive?: boolean;
}

const variantStyles: Record<'default' | 'outlined' | 'elevated', string> = {
  default: 'border border-border bg-card text-card-foreground',
  outlined: 'border-2 border-border bg-transparent',
  elevated: 'border-0 shadow-lg bg-card text-card-foreground',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = 'default', density = 'default', asChild = false, interactive = false, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <CardDensityContext.Provider value={density}>
        <Comp
          ref={ref}
          className={cn(
            'rounded-lg text-left',
            variantStyles[variant],
            density === 'compact' && 'shadow-sm',
            interactive &&
              'cursor-pointer transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            className
          )}
          {...props}
        >
          {children}
        </Comp>
      </CardDensityContext.Provider>
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
  tick?: boolean;
}

export const CardHeader = React.memo(
  forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, title, subtitle, eyebrow, icon, actions, bordered, tick = false, children, ...props }, ref) => {
      const density = useContext(CardDensityContext);
      const compact = density === 'compact';
      const showBorder = bordered ?? compact;
      const hasStructuralProps =
        title !== undefined || subtitle !== undefined || actions !== undefined || eyebrow !== undefined || icon !== undefined;
      if (!hasStructuralProps) {
        return (
          <div
            ref={ref}
            className={cn(
              'flex flex-col space-y-1.5 p-6',
              showBorder && 'border-b border-border',
              compact && 'min-h-[44px] flex-row items-center gap-2.5 px-3.5 py-2',
              className
            )}
            {...props}
          >
            {children}
          </div>
        );
      }
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-start justify-between gap-4 p-6',
            showBorder && 'border-b border-border',
            compact && 'min-h-[44px] items-center gap-2.5 px-3.5 py-2',
            className
          )}
          {...props}
        >
          <div className={cn('flex min-w-0 flex-col space-y-1.5', compact && 'flex-wrap items-baseline gap-x-2 gap-y-0.5 space-y-0')}>
            {eyebrow !== undefined && (
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{eyebrow}</p>
            )}
            {title !== undefined && (
              <div className="flex items-center gap-2">
                {tick && <span className="h-3.5 w-[3px] shrink-0 rounded-[2px] bg-accent" aria-hidden />}
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
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.memo(
  forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => {
    const compact = useContext(CardDensityContext) === 'compact';
    return (
      <h3
        ref={ref}
        className={cn(
          'text-lg font-semibold leading-none tracking-tight',
          compact && 'text-sm font-bold leading-none tracking-tight',
          className
        )}
        {...props}
      />
    );
  })
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.memo(
  forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => {
    const compact = useContext(CardDensityContext) === 'compact';
    return (
      <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', compact && 'text-[11.5px] leading-none text-muted-foreground', className)}
        {...props}
      />
    );
  })
);

CardDescription.displayName = 'CardDescription';

export const CardContent = React.memo(
  forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
    const compact = useContext(CardDensityContext) === 'compact';
    return <div ref={ref} className={cn('p-6 pt-0', compact && 'p-3.5', className)} {...props} />;
  })
);

CardContent.displayName = 'CardContent';

export const CardFooter = React.memo(
  forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
    const compact = useContext(CardDensityContext) === 'compact';
    return <div ref={ref} className={cn('flex items-center p-6 pt-0', compact && 'p-3.5 pt-0', className)} {...props} />;
  })
);

CardFooter.displayName = 'CardFooter';
