
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '../../infrastructure/utils';

export type ToastKind = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  kind: ToastKind;
  title: string;
  description?: string;
  /** Per-toast duration override (ms) — wins over the kind policy. */
  duration?: number;
}

export interface ToastShorthandOptions {
  tone?: ToastKind | 'danger' | 'neutral';
  message?: string;
  /** Per-toast duration override (ms) — wins over the kind policy. */
  duration?: number;
}

interface ToastApi {
  toast: {
    (t: ToastOptions): void;
    (title: string, options?: ToastShorthandOptions): void;
  };
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

const noop = (): void => {};
const ToastContext = createContext<ToastApi>({
  toast: noop as ToastApi['toast'],
  success: noop,
  error: noop,
  warning: noop,
  info: noop,
});

export function useToast(): ToastApi {
  return useContext(ToastContext);
}

const kindMeta: Record<ToastKind, { icon: typeof CheckCircle2; accent: string; iconColor: string }> = {
  success: { icon: CheckCircle2, accent: 'border-l-success', iconColor: 'text-success' },
  error: { icon: XCircle, accent: 'border-l-destructive', iconColor: 'text-destructive' },
  warning: { icon: AlertTriangle, accent: 'border-l-warning', iconColor: 'text-warning' },
  info: { icon: Info, accent: 'border-l-info', iconColor: 'text-info' },
};

export interface ToastProviderProps {
  children: ReactNode;
  maxVisible?: number;
  /** Global duration override (ms). Unset (default): the per-kind
   * policy below decides — success fades fast, errors stick around
   * long enough to be read. */
  duration?: number;
}

/* Faz 50 (1977): the duration policy — one tone system, one timing
 * rule. A success is a confirmation glance, an error must survive
 * being read. Every app toast inherits this; overrides are explicit. */
const DURATION_BY_KIND: Record<ToastKind, number> = {
  success: 3600,
  info: 4200,
  warning: 6000,
  error: 8000,
};

const toneAliases: Record<NonNullable<ToastShorthandOptions['tone']>, ToastKind> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  danger: 'error',
  neutral: 'info',
};

const normalizeTone = (tone?: ToastShorthandOptions['tone']): ToastKind =>
  tone === undefined ? 'info' : toneAliases[tone];

export function ToastProvider({ children, maxVisible = 4, duration }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (tOrTitle: ToastOptions | string, shorthand?: ToastShorthandOptions) => {
      const t: ToastOptions =
        typeof tOrTitle === 'string'
          ? {
              title: tOrTitle,
              kind: normalizeTone(shorthand?.tone),
              description: shorthand?.message,
              duration: shorthand?.duration,
            }
          : tOrTitle;
      const id = ++counter.current;
      setToasts((list) => [...list.slice(-(maxVisible - 1)), { id, ...t }]);
      const ttl = t.duration ?? duration ?? DURATION_BY_KIND[t.kind];
      setTimeout(() => dismiss(id), ttl);
    },
    [dismiss, maxVisible, duration],
  );

  const value = useMemo<ToastApi>(
    () => ({
      toast,
      success: (title: string, description?: string) => toast({ kind: 'success', title, description }),
      error: (title: string, description?: string) => toast({ kind: 'error', title, description }),
      warning: (title: string, description?: string) => toast({ kind: 'warning', title, description }),
      info: (title: string, description?: string) => toast({ kind: 'info', title, description }),
    }),
    [toast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[340px] max-w-[calc(100vw-2rem)] flex-col gap-2"
      >
        {toasts.map((t) => {
          const meta = kindMeta[t.kind];
          const Icon = meta.icon;
          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex items-start gap-2.5 rounded-lg border border-border border-l-[3px] bg-popover p-3 text-popover-foreground shadow-lg',
                meta.accent,
              )}
            >
              <Icon className={cn('mt-px h-4 w-4 shrink-0', meta.iconColor)} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{t.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
