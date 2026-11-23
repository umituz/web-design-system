import { forwardRef, useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

/** A persistent coaching bubble — unlike Tooltip (hover-revealed, short),
 * HintBubble is rendered by application state and stays until dismissed.
 * Accessibility contract (pinned by consumers' a11y tests):
 *  - the bubble announces itself politely: role="status" + aria-live="polite",
 *    never aria-live="assertive" (coaching is not an emergency);
 *  - it NEVER traps or steals focus: no autofocus, no focus() calls, no
 *    preventDefault on Tab. Keyboard users simply read past it; the dismiss
 *    control is an ordinary button in the tab order;
 *  - Escape closes it only when focus sits inside the bubble, so a globally
 *    mounted hint cannot swallow Escape from dialogs beneath it.
 */
export interface HintBubbleAction {
  label: string;
  onClick: () => void;
}

export interface HintBubbleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, BaseProps {
  /** Screen-reader heading + visual eyebrow. */
  title: string;
  body?: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Primary in-bubble action (e.g. "Next" on a guided tour). */
  action?: HintBubbleAction;
  /** Dismiss control; omit for hints the app manages externally. */
  onDismiss?: () => void;
  dismissLabel?: string;
  /** Step position label, e.g. "2 of 5" on a guided tour. */
  stepLabel?: string;
}

const placementStyles: Record<NonNullable<HintBubbleProps['placement']>, string> = {
  top: 'bottom-full mb-2',
  bottom: 'top-full mt-2',
  left: 'right-full mr-2',
  right: 'left-full ml-2',
};

export const HintBubble = forwardRef<HTMLDivElement, HintBubbleProps>(
  (
    {
      className,
      title,
      body,
      placement = 'bottom',
      action,
      onDismiss,
      dismissLabel = 'Dismiss',
      stepLabel,
      ...props
    },
    ref,
  ) => {
    const headingId = useId();
    // The live node, for the contained-Escape check only — never focused.
    const nodeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!onDismiss) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Escape') return;
        const node = nodeRef.current;
        // Only when focus is inside the bubble (no global Escape stealing).
        if (node && (document.activeElement === node || node.contains(document.activeElement))) {
          e.stopPropagation();
          onDismiss();
        }
      };
      document.addEventListener('keydown', onKeyDown, true);
      return () => document.removeEventListener('keydown', onKeyDown, true);
    }, [onDismiss]);

    return (
      <div
        ref={(node) => {
          nodeRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as { current: HTMLDivElement | null }).current = node;
        }}
        role="status"
        aria-live="polite"
        aria-labelledby={headingId}
        className={cn(
          'absolute z-50 w-64 rounded-lg border bg-popover text-popover-foreground p-3 shadow-lg',
          placementStyles[placement],
          className,
        )}
        {...props}
      >
        {stepLabel && (
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{stepLabel}</p>
        )}
        <p id={headingId} className="text-sm font-semibold text-foreground">
          {title}
        </p>
        {body && <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</div>}
        {(action || onDismiss) && (
          <div className="mt-3 flex items-center gap-2">
            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className="inline-flex h-7 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                {action.label}
              </button>
            )}
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex h-7 items-center justify-center rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {dismissLabel}
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);

HintBubble.displayName = 'HintBubble';
