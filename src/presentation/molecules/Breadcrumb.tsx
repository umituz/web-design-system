/**
 * Breadcrumb Component (Molecule)
 * @description Simple navigation breadcrumb trail using design system atoms
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import { Link } from '../atoms/Link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement>, BaseProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  homeHref?: string;
  separator?: ReactNode;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      className,
      items,
      showHomeIcon = false,
      homeHref = '/',
      separator,
      ...props
    },
    ref
  ) => {
    const renderSeparator = () => {
      if (separator) return separator;
      return <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />;
    };

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('mb-4 flex items-center gap-2 text-sm md:mb-6', className)}
        {...props}
      >
        {showHomeIcon && (
          <>
            <Link
              href={homeHref}
              className="text-muted-foreground hover:text-primary"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </Link>
            {items.length > 0 && renderSeparator()}
          </>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <div key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && renderSeparator()}
              {item.icon}
              {item.href && !isLast ? (
                <Link href={item.href} className="text-muted-foreground hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast ? 'font-medium text-foreground' : 'text-muted-foreground'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
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

Breadcrumb.displayName = 'Breadcrumb';
