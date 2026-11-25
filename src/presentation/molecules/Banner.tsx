import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Info, AlertTriangle, AlertCircle, CheckCircle2, Megaphone, X } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export type BannerTone = 'brand' | 'info' | 'success' | 'warning' | 'destructive' | 'neutral';

export interface BannerAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, BaseProps {
  tone?: BannerTone;
  variant?: BannerTone;
  title?: ReactNode;
  icon?: ReactNode;
  hideIcon?: boolean;
  action?: ReactNode | BannerAction;
  dismissible?: boolean;
  onDismiss?: () => void;
  compact?: boolean;
  sticky?: boolean;
  bordered?: boolean;
}

const toneStyles: Record<BannerTone, string> = {
  brand: 'bg-primary/10 text-primary border-primary/20',
  info: 'bg-info/10 text-info-foreground border-info/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning-foreground border-warning/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  neutral: 'bg-muted/70 text-foreground border-border',
};

const defaultToneIcons: Record<BannerTone, typeof Info> = {
  brand: Megaphone,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: AlertCircle,
  neutral: Info,
};

export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      tone,
      variant,
      title,
      icon,
      hideIcon = false,
      action,
      dismissible = false,
      onDismiss,
      compact = false,
      sticky = false,
      bordered = true,
      children,
      role,
      ...props
    },
    ref
  ) => {
    const [dismissed, setDismissed] = useState(false);
    const resolvedTone = tone ?? variant ?? 'info';
    const DefaultIcon = defaultToneIcons[resolvedTone];

    if (dismissed) return null;

    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    const renderAction = () => {
      if (!action) return null;
      if (typeof action === 'object' && action !== null && 'label' in action && typeof (action as BannerAction).label === 'string') {
        const item = action as BannerAction;
        if (item.href) {
          return (
            <a
              href={item.href}
              onClick={item.onClick}
              className="inline-flex shrink-0 items-center justify-center rounded-md px-2.5 py-1 text-xs font-semibold underline-offset-4 hover:underline"
            >
              {item.label}
            </a>
          );
        }
        return (
          <button
            type="button"
            onClick={item.onClick}
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-background/80 px-2.5 py-1 text-xs font-semibold shadow-xs hover:bg-background transition-colors"
          >
            {item.label}
          </button>
        );
      }
      return <div className="shrink-0">{action as ReactNode}</div>;
    };

    return (
      <div
        ref={ref}
        role={role ?? (resolvedTone === 'destructive' || resolvedTone === 'warning' ? 'alert' : 'status')}
        className={cn(
          'flex items-center justify-between gap-3 text-sm transition-all',
          bordered && 'border',
          sticky && 'sticky top-0 z-40',
          compact ? 'px-3 py-2 text-xs' : 'px-4 py-3',
          toneStyles[resolvedTone],
          className
        )}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          {!hideIcon && (
            <span aria-hidden="true" className="shrink-0">
              {icon ?? <DefaultIcon className="size-4" />}
            </span>
          )}
          <div className="min-w-0 flex-1">
            {title && <span className="font-semibold mr-1.5">{title}</span>}
            {children}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {renderAction()}
          {dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Banner.displayName = 'Banner';
