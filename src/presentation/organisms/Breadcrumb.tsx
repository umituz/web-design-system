/**
 * Breadcrumb Component (Organism)
 * @description Navigation breadcrumb trail
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import { Icon } from '../atoms/Icon';
import { Link } from '../atoms/Link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement>, BaseProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ className, items, separator, ...props }, ref) => {
    const defaultSeparator = (
      <Icon size="xs" className="text-muted-foreground">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </Icon>
    );

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('flex items-center gap-2 text-sm', className)}
        {...props}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && (separator || defaultSeparator)}

              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5',
                    isLast
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1.5',
                    isLast
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.icon}
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
