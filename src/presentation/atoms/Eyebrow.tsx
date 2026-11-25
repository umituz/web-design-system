import { forwardRef, type HTMLAttributes, type ElementType } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export type EyebrowTone = 'muted' | 'primary' | 'destructive' | 'warning' | 'success' | 'ink';

export interface EyebrowProps extends HTMLAttributes<HTMLElement>, BaseProps {
  as?: ElementType;
  tone?: EyebrowTone;
}

const toneStyles: Record<EyebrowTone, string> = {
  muted: 'text-muted-foreground',
  primary: 'text-primary',
  destructive: 'text-destructive',
  warning: 'text-warning',
  success: 'text-success',
  ink: 'text-ink-3',
};

export const Eyebrow = forwardRef<HTMLElement, EyebrowProps>(
  ({ as: Comp = 'p', tone = 'muted', className, children, ...props }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-[11px] font-bold uppercase tracking-[0.14em]',
          toneStyles[tone],
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Eyebrow.displayName = 'Eyebrow';
