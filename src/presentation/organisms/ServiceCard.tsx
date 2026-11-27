import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';

export interface ServiceCardFact {
  label: ReactNode;
  value: ReactNode;
}

export interface ServiceCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  description?: ReactNode;
  visual?: ReactNode;
  facts?: readonly ServiceCardFact[];
  note?: ReactNode;
  warningNote?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ServiceCard({
  title,
  subtitle,
  badge,
  description,
  visual,
  facts,
  note,
  warningNote,
  action,
  onClick,
  className,
  ...rest
}: ServiceCardProps) {
  const isClickable = Boolean(onClick);

  return (
    <article
      onClick={onClick}
      className={cn(
        'group flex flex-col sm:flex-row items-start gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs transition-all duration-150',
        isClickable && 'cursor-pointer hover:border-primary/50 hover:shadow-sm',
        className,
      )}
      {...rest}
    >
      {visual && (
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/40">
          {visual}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground truncate">
              {title}
            </h3>
            {subtitle && (
              <span className="text-xs text-muted-foreground truncate font-medium">
                {subtitle}
              </span>
            )}
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        )}

        {facts && facts.length > 0 && (
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-border/50">
            {facts.map((fact, index) => (
              <div key={index} className="flex flex-col">
                <dt className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  {fact.label}
                </dt>
                <dd className="text-xs font-semibold text-foreground">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {note && (
          <div className="rounded-md bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground">
            {note}
          </div>
        )}

        {warningNote && (
          <div className="rounded-md bg-warning/10 border border-warning/20 px-2.5 py-1.5 text-xs font-medium text-warning">
            {warningNote}
          </div>
        )}

        {action && (
          <div className="pt-2 flex justify-end">
            {action}
          </div>
        )}
      </div>
    </article>
  );
}
