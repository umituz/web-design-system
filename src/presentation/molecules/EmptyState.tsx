import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../infrastructure/utils';

/* The empty-state half of the state family (Faz 50, 1972): every "there
 * is nothing here yet" lane in every app renders THIS contract — an icon,
 * one honest line, an optional description and an optional first action.
 * A quiet dashed panel: an empty state is information, never an error,
 * so it stays neutral (or `positive` when emptiness IS the good news —
 * an empty moderation queue). role=status so screen readers announce
 * the message politely without stealing focus. */

export interface EmptyStateProps {
  /** Optional leading glyph — the surface's own vocabulary (Inbox, Users…). */
  icon?: LucideIcon;
  /** The single honest line ("No proposals received yet."). */
  title: ReactNode;
  /** Optional supporting sentence — what changes the state. */
  description?: ReactNode;
  /** Optional first action (a small button / link) that fills the void. */
  action?: ReactNode;
  /** `positive` tones the glyph — emptiness as good news. */
  tone?: 'neutral' | 'positive';
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = 'neutral',
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'empty-state grid content-start justify-items-start gap-2.5 rounded-lg border border-dashed border-border bg-card px-6 py-8',
        className,
      )}
    >
      {Icon ? (
        <Icon
          size={22}
          aria-hidden="true"
          className={cn(
            'empty-state__icon',
            tone === 'positive' ? 'text-success' : 'text-muted-foreground',
          )}
        />
      ) : null}
      <p className="empty-state__title m-0 text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="empty-state__desc m-0 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="empty-state__action mt-1">{action}</div> : null}
    </div>
  );
}
