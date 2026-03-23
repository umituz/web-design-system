/**
 * Link Component (Atom)
 * @description Styled anchor/link element
 */

import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import type { BaseProps } from '../../domain/types';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement>, BaseProps {
  variant?: 'default' | 'primary' | 'muted';
  underline?: 'none' | 'hover' | 'always';
}

const variantStyles: Record<'default' | 'primary' | 'muted', string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  muted: 'text-muted-foreground',
};

const underlineStyles: Record<'none' | 'hover' | 'always', string> = {
  none: '',
  hover: 'hover:underline',
  always: 'underline',
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = 'default', underline = 'hover', ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
          variantStyles[variant],
          underlineStyles[underline],
          className
        )}
        {...props}
      />
    );
  }
);

Link.displayName = 'Link';
