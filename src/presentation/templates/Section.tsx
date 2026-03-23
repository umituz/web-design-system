/**
 * Section Template (Template)
 * @description Content section with header
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface SectionProps extends HTMLAttributes<HTMLElement>, BaseProps {
  title?: string;
  description?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('space-y-4', className)}
        {...props}
      >
        {(title || description) && (
          <div className="space-y-1">
            {title && (
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';
