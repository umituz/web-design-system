/**
 * Timeline Component (Organism)
 * @description Vertical activity timeline: meta line, title, optional body, tone dot
 */

import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export type TimelineTone = 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'neutral' | 'violet';

export interface TimelineItem {
  /** ISO timestamp rendered as the meta line unless `meta` overrides it. */
  at: string;
  title: ReactNode;
  body?: ReactNode;
  tone?: TimelineTone;
  meta?: ReactNode;
  /** Replaces the tone dot with an icon, tinted by `tone` (or muted when omitted). */
  icon?: ReactNode;
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement>, BaseProps {
  items: TimelineItem[];
  /** Render newest first (default) instead of the given order. */
  newestFirst?: boolean;
}

const toneStyles: Record<TimelineTone, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
  info: 'bg-info',
  neutral: 'bg-muted-foreground/40',
  violet: 'bg-violet-500',
};

const iconToneStyles: Record<TimelineTone, string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
  info: 'text-info',
  neutral: 'text-muted-foreground',
  violet: 'text-violet-500',
};

function formatAt(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(
  ({ items, newestFirst = true, className, ...props }, ref) => (
    <ol ref={ref} className={cn('relative flex flex-col gap-4 border-l border-border pl-5', className)} {...props}>
      {(newestFirst ? [...items].reverse() : items).map((it, i) => (
        <li key={i} className="relative">
          {it.icon !== undefined ? (
            <span
              aria-hidden="true"
              className={cn(
                'absolute -left-[1.55rem] top-0 flex h-3.5 w-3.5 items-center justify-center',
                iconToneStyles[it.tone ?? 'neutral']
              )}
            >
              {it.icon}
            </span>
          ) : (
            <span
              aria-hidden="true"
              className={cn('absolute -left-[1.55rem] top-1.5 h-2 w-2 rounded-full', toneStyles[it.tone ?? 'neutral'])}
            />
          )}
          <p className="text-xs text-muted-foreground">{it.meta ?? formatAt(it.at)}</p>
          <p className="mt-0.5 text-sm font-medium leading-snug">{it.title}</p>
          {it.body !== undefined && <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{it.body}</p>}
        </li>
      ))}
    </ol>
  )
);

Timeline.displayName = 'Timeline';
