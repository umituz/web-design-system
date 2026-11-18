import { forwardRef, type ReactNode } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import { ErrorActions, type NotFoundAction } from './NotFoundPage';

/** Route error → { title, detail }: 4xx/5xx route responses carry status +
 *  optional string data, thrown Errors their message, anything else its
 *  String(). Exported for apps that render their own chrome around it. */
export function describeRouteError(error: unknown): { title: string; detail: string } {
  if (isRouteErrorResponse(error)) {
    return {
      title: `${error.status} — ${error.statusText || 'Route error'}`,
      detail:
        typeof error.data === 'string' && error.data
          ? error.data
          : 'The router rejected this navigation.',
    };
  }
  if (error instanceof Error) {
    return { title: 'Something went wrong', detail: error.message };
  }
  return { title: 'Something went wrong', detail: String(error) };
}

export interface RouteErrorPageProps extends BaseProps {
  /** Console-log tag — the app name, e.g. 'polaris'. */
  app?: string;
  /** Extra hint under the detail line (e.g. a session-safety note). */
  note?: ReactNode;
  actions?: readonly NotFoundAction[];
  /** Secondary action target when `actions` is not set (default '/'). */
  homeTo?: string;
  homeLabel?: string;
}

/** Router `errorElement` body: reads useRouteError, logs it once with the
 *  app tag, and renders title/detail + Reload & home actions by default. */
export const RouteErrorPage = forwardRef<HTMLDivElement, RouteErrorPageProps>(
  ({ className, app = 'app', note, actions, homeTo = '/', homeLabel = 'Back to app', ...props }, ref) => {
    const error = useRouteError();
    console.error(`[${app}] Unhandled route error:`, error);
    const { title, detail } = describeRouteError(error);
    const resolved: readonly NotFoundAction[] = actions ?? [
      { label: 'Reload', onClick: () => window.location.reload() },
      { label: homeLabel, to: homeTo },
    ];
    return (
      <div
        ref={ref}
        role="alert"
        className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}
        {...props}
      >
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="max-w-md text-sm text-muted-foreground">{detail}</p>
        {note != null && <p className="max-w-md text-xs text-muted-foreground/80">{note}</p>}
        <ErrorActions actions={resolved} />
      </div>
    );
  },
);
RouteErrorPage.displayName = 'RouteErrorPage';
