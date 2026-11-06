import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export type TextAlign = 'left' | 'center' | 'right';
export type HeaderSize = 'small' | 'medium' | 'large';

export interface PageHeaderCrumb {
  label: string;
  to?: string;
}

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, BaseProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  kicker?: ReactNode;
  breadcrumbs?: ReactNode | readonly PageHeaderCrumb[];
  meta?: ReactNode;
  align?: TextAlign;
  size?: HeaderSize;
  actions?: ReactNode;
}

const isCrumbList = (
  value: ReactNode | readonly PageHeaderCrumb[]
): value is readonly PageHeaderCrumb[] =>
  Array.isArray(value) &&
  value.every((item) => typeof item === 'object' && item !== null && 'label' in item);

const sizeClasses: Record<HeaderSize, { title: string; subtitle: string }> = {
  small: {
    title: 'text-xl sm:text-2xl font-bold tracking-tight',
    subtitle: 'text-xs sm:text-sm',
  },
  medium: {
    title: 'text-2xl sm:text-3xl font-bold tracking-tight',
    subtitle: 'text-sm sm:text-base',
  },
  large: {
    title: 'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight',
    subtitle: 'text-base sm:text-lg',
  },
};

const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      title,
      subtitle,
      description,
      kicker,
      breadcrumbs,
      meta,
      align = 'left',
      size = 'small',
      actions,
      className,
      ...props
    },
    ref
  ) => {
    const desc = subtitle ?? description;

    const crumbNode =
      breadcrumbs === undefined
        ? undefined
        : isCrumbList(breadcrumbs)
          ? breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-1">
                {index > 0 && <span className="opacity-40 select-none">/</span>}
                {crumb.to !== undefined ? (
                  <Link to={crumb.to} className="hover:underline hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))
          : breadcrumbs;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-2 mb-6',
          alignClasses[align],
          className
        )}
        {...props}
      >
        {crumbNode !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            {crumbNode}
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {kicker !== undefined && (
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                {kicker}
              </p>
            )}

            {title !== undefined && (
              <h1 className={cn(sizeClasses[size].title, 'text-foreground')}>
                {title}
              </h1>
            )}

            {desc !== undefined && (
              <p className={cn(sizeClasses[size].subtitle, 'text-muted-foreground mt-1 leading-relaxed')}>
                {desc}
              </p>
            )}

            {meta !== undefined && (
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                {meta}
              </div>
            )}
          </div>

          {actions && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';
