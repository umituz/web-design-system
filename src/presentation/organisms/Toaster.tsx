/**
 * Toaster Component (Organism)
 * @description Toast notification system. ToastProvider wraps the app root
 * ONCE and renders the viewport (bottom-right stack, max 4, auto-dismiss
 * 4.2 s); pages fire toasts via useToast()({ kind, title, description }).
 */

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '../../infrastructure/utils';

export type ToastKind = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  kind: ToastKind;
  title: string;
  description?: string;
}

export interface ToastShorthandOptions {
  tone?: ToastKind | 'danger' | 'neutral';
  message?: string;
}

interface ToastApi {
  /** Fire a toast — after every mutating action is the fleet idiom. */
  toast: {
    (t: ToastOptions): void;
    /** Shorthand call: toast('Saved', { tone: 'success', message: '…' }). */
    (title: string, options?: ToastShorthandOptions): void;
  };
}

interface ToastEntry extends ToastOptions {
  id: number;
}

const ToastContext = createContext<ToastApi>({ toast: () => {} });

/** Consume from any page below the provider: const { toast } = useToast(); */
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
  duration?: number;
}

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

export function ToastProvider({ children, maxVisible = 4, duration = 4200 }: ToastProviderProps) {
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
            }
          : tOrTitle;
      const id = ++counter.current;
      setToasts((list) => [...list.slice(-(maxVisible - 1)), { id, ...t }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss, maxVisible, duration],
  );

  const value = useMemo(() => ({ toast }), [toast]);

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
