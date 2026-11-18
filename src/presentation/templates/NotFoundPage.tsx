import { forwardRef, type ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

/** A route-level action: `to` renders a router link, `onClick` a plain
 *  button. The first action defaults to primary, the rest secondary. */
export interface NotFoundAction {
  label: string;
  to?: string;
  onClick?: () => void;
  variant?: React.ComponentProps<typeof Button>['variant'];
  icon?: ReactNode;
}

export interface NotFoundPageProps extends BaseProps {
  /** Big status code above the title — pass an empty string to hide it. */
  code?: string;
  title?: ReactNode;
  description?: ReactNode;
  /** Small overline above the code (e.g. '404 · AGROMERA'). */
  kicker?: ReactNode;
  actions?: readonly NotFoundAction[];
  /** Convenience for the common single action — ignored when `actions` is set. */
  homeTo?: string;
  homeLabel?: string;
}

/** The action row both route-status templates share. */
export function ErrorActions({ actions }: { actions: readonly NotFoundAction[] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
      {actions.map((action, index) => (
        <Button
          key={action.label}
          variant={action.variant ?? (index === 0 ? 'primary' : 'secondary')}
          to={action.to}
          onClick={action.onClick}
          icon={action.icon}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

/** Centered route-status page skeleton: overline, status code, title,
 *  description, actions. Brand voice stays with the caller — every string
 *  is a prop, nothing is hardcoded beyond sensible defaults. */
export const NotFoundPage = forwardRef<HTMLDivElement, NotFoundPageProps>(
  (
    {
      className,
      code = '404',
      title = 'Page not found',
      description,
      kicker,
      actions,
      homeTo,
      homeLabel = 'Back to home',
      ...props
    },
    ref,
  ) => {
    const resolved: readonly NotFoundAction[] = actions ?? (homeTo ? [{ label: homeLabel, to: homeTo }] : []);
    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}
        {...props}
      >
        {kicker != null && (
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{kicker}</p>
        )}
        {code ? (
          <p aria-hidden="true" className="font-mono text-4xl font-bold text-muted-foreground/40 sm:text-5xl">
            {code}
          </p>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description != null && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
        {resolved.length > 0 && <ErrorActions actions={resolved} />}
      </div>
    );
  },
);
NotFoundPage.displayName = 'NotFoundPage';
