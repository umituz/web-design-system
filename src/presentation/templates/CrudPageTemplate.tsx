import * as React from 'react';
import { Breadcrumbs, type BreadcrumbItem } from '../organisms/Breadcrumb';
import { cn } from '../../infrastructure/utils';

export interface CrudPageTemplateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  actions?: React.ReactNode;
  stats?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}

export const CrudPageTemplate = React.forwardRef<HTMLDivElement, CrudPageTemplateProps>(
  (
    {
      title,
      description,
      breadcrumbItems,
      actions,
      stats,
      toolbar,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8', className)}
        {...props}
      >
        {/* Breadcrumbs */}
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <div>
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>

        {/* Optional Stats Grid */}
        {stats && <div>{stats}</div>}

        {/* Optional Search / Filter Toolbar */}
        {toolbar && <div>{toolbar}</div>}

        {/* Main Content (Table / List / Cards) */}
        <div className="w-full">{children}</div>
      </div>
    );
  }
);

CrudPageTemplate.displayName = 'CrudPageTemplate';
