import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';

export type PipelineStepTone = 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'info';

export interface PipelineStepItem {
  id: string;
  label: ReactNode;
  count?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  tone?: PipelineStepTone;
  onClick?: () => void;
}

export interface PipelineStripProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  steps?: readonly PipelineStepItem[];
  items?: readonly PipelineStepItem[];
  variant?: 'default' | 'mini';
  columns?: 2 | 3 | 4 | 5 | 6;
  ariaLabel?: string;
  className?: string;
}

export interface PipelineStepProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  label: ReactNode;
  count?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'mini';
  tone?: PipelineStepTone;
  onClick?: () => void;
  className?: string;
}

const toneActiveStyles: Record<PipelineStepTone, string> = {
  default: 'border-primary bg-primary/10 text-primary shadow-xs',
  primary: 'border-primary bg-primary/10 text-primary shadow-xs',
  success: 'border-success bg-success/10 text-success shadow-xs',
  warning: 'border-warning bg-warning/10 text-warning shadow-xs',
  destructive: 'border-destructive bg-destructive/10 text-destructive shadow-xs',
  info: 'border-info bg-info/10 text-info shadow-xs',
};

export function PipelineStep({
  label,
  count,
  active = false,
  disabled = false,
  variant = 'default',
  tone = 'default',
  onClick,
  className,
  ...rest
}: PipelineStepProps) {
  const isMini = variant === 'mini';

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'group flex flex-col items-start justify-center rounded-lg border text-left transition-all duration-150',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
        isMini ? 'gap-0.5 p-2' : 'gap-1 p-3.5',
        disabled && 'pointer-events-none opacity-45',
        active
          ? toneActiveStyles[tone]
          : 'border-border bg-card text-card-foreground shadow-xs hover:border-border hover:bg-muted/50',
        className,
      )}
      {...rest}
    >
      {count !== undefined && count !== null && (
        <span
          className={cn(
            'font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary',
            isMini ? 'text-base leading-tight' : 'text-xl leading-none',
            active && 'text-primary',
          )}
        >
          {count}
        </span>
      )}
      <span
        className={cn(
          'text-muted-foreground truncate font-medium transition-colors',
          isMini ? 'text-[11px] leading-tight' : 'text-xs leading-normal',
          active && 'text-foreground font-semibold',
        )}
      >
        {label}
      </span>
    </button>
  );
}

const columnGridStyles: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
};

export function PipelineStrip({
  steps,
  items,
  variant = 'default',
  columns,
  ariaLabel = 'Pipeline stages',
  className,
  ...rest
}: PipelineStripProps) {
  const list = steps ?? items ?? [];
  const colCount = columns ?? (Math.min(Math.max(list.length, 2), 5) as 2 | 3 | 4 | 5);
  const gridClass = columnGridStyles[colCount] ?? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5';

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('grid gap-2.5', gridClass, variant === 'mini' && 'gap-2', className)}
      {...rest}
    >
      {list.map((step) => (
        <PipelineStep
          key={step.id}
          label={step.label}
          count={step.count}
          active={step.active}
          disabled={step.disabled}
          tone={step.tone}
          variant={variant}
          onClick={step.onClick}
        />
      ))}
    </div>
  );
}
