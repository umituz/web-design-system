import * as React from 'react';
import { Card } from './Card';
import { Badge, type BadgeVariant } from '../atoms/Badge';
import { CopyButton } from '../atoms/CopyButton';
import { cn } from '../../infrastructure/utils';

export interface DescriptionItem {
  key?: string;
  label: string;
  value: React.ReactNode;
  copyable?: boolean;
  copyText?: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  hint?: string;
}

export interface DescriptionListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  items: DescriptionItem[];
  columns?: 1 | 2;
  bordered?: boolean;
}

export const DescriptionList = React.forwardRef<HTMLDivElement, DescriptionListProps>(
  (
    {
      title,
      description,
      action,
      items,
      columns = 1,
      bordered = true,
      className,
      ...props
    },
    ref
  ) => {
    const content = (
      <div
        ref={ref}
        className={cn('w-full flex flex-col gap-4', className)}
        {...props}
      >
        {(title || action || description) && (
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-border">
            <div>
              {title && (
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {description}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}

        <dl
          className={cn(
            'grid gap-x-6 gap-y-3',
            columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
          )}
        >
          {items.map((item, idx) => {
            const rawCopyText = item.copyText ?? (typeof item.value === 'string' ? item.value : '');

            return (
              <div
                key={item.key ?? idx}
                className="flex items-center justify-between py-2 border-b border-border/60 last:border-0 gap-3"
              >
                <dt className="text-sm font-medium text-muted-foreground shrink-0">
                  {item.label}
                  {item.hint && (
                    <span className="block text-xs font-normal text-muted-foreground/75">
                      {item.hint}
                    </span>
                  )}
                </dt>
                <dd className="text-sm font-medium text-foreground flex items-center gap-2 text-right break-all">
                  {item.value}
                  {item.badge && (
                    <Badge variant={item.badgeVariant ?? 'secondary'} size="sm">
                      {item.badge}
                    </Badge>
                  )}
                  {item.copyable && rawCopyText && (
                    <CopyButton text={rawCopyText} size="xs" />
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    );

    if (bordered) {
      return <Card className="p-5">{content}</Card>;
    }

    return content;
  }
);

DescriptionList.displayName = 'DescriptionList';
