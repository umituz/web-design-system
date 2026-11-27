import type { ReactNode } from 'react';
import { LifeBuoy, RotateCcw, TriangleAlert } from 'lucide-react';
import { Button } from '../atoms/Button';
import { cn } from '../../infrastructure/utils';

/* The error half of the state family (Faz 50, 1973): data-shaped
 * failures (a fetch that came back non-2xx, a panel that could not
 * load) render THIS contract — what failed, one retry that actually
 * re-runs the request, and an escape hatch to support. role=alert:
 * unlike the empty state, an error IS worth interrupting for.
 *
 * Render crashes live one level up in the consumer's error boundary;
 * this molecule is for the honest, recoverable kind. The support link
 * is a prop, not a constant — each app points it at its own help
 * center (Faz 26 bridge). */

export interface ErrorStateProps {
  title?: string;
  /** What actually failed, in plain words — no stack, no codes. */
  description?: ReactNode;
  /** Re-runs the failed request. Omit when retry cannot help. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Link to the app's help center — the human escape hatch. */
  supportHref?: string;
  supportLabel?: string;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  retryLabel = 'Try again',
  supportHref,
  supportLabel = 'Get help',
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'error-state grid content-start justify-items-start gap-2.5 rounded-lg border border-border bg-card px-6 py-8',
        className,
      )}
    >
      <TriangleAlert size={22} aria-hidden="true" className="error-state__icon text-destructive" />
      <p className="error-state__title m-0 text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="error-state__desc m-0 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {(onRetry || supportHref) && (
        <div className="error-state__actions mt-1 flex flex-wrap items-center gap-2">
          {onRetry && (
            <Button type="button" size="xs" variant="outline" icon={<RotateCcw />} onClick={onRetry}>
              {retryLabel}
            </Button>
          )}
          {supportHref && (
            <Button type="button" size="xs" variant="ghost" icon={<LifeBuoy />} asChild>
              <a href={supportHref}>{supportLabel}</a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
