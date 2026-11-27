import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';

export type ProgressionStatus = 'done' | 'current' | 'pending';

export interface ProgressionStep {
  id: string;
  name: ReactNode;
  date?: ReactNode;
  status: ProgressionStatus;
  color?: string;
}

export interface ProgressionTimelineProps extends HTMLAttributes<HTMLDivElement> {
  steps: readonly ProgressionStep[];
  compact?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function ProgressionTimeline({
  steps,
  compact = false,
  ariaLabel = 'Progression ladder',
  className,
  ...rest
}: ProgressionTimelineProps) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        'flex items-stretch overflow-x-auto py-2 scrollbar-none',
        className,
      )}
      {...rest}
    >
      {steps.map((step, index) => {
        const isDone = step.status === 'done';
        const isCur = step.status === 'current';

        return (
          <div
            key={step.id}
            className={cn(
              'group relative flex flex-1 min-w-[76px] sm:min-w-[96px] flex-col items-center pt-2 text-center',
              isDone && 'text-foreground',
              isCur && 'text-primary font-semibold',
              step.status === 'pending' && 'text-muted-foreground opacity-60',
            )}
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-[17px] left-[-50%] right-[50%] h-[3px] transition-colors',
                  isDone || isCur ? 'bg-primary' : 'bg-border',
                )}
              />
            )}

            <span
              aria-hidden="true"
              style={step.color ? { backgroundColor: step.color } : undefined}
              className={cn(
                'relative z-1 flex size-5 items-center justify-center rounded-full border-2 transition-all',
                isDone && 'border-primary bg-primary text-primary-foreground',
                isCur && 'size-6 border-primary bg-background ring-4 ring-primary/20',
                step.status === 'pending' && 'border-border bg-muted',
              )}
            >
              {isCur && (
                <span className="size-2 rounded-full bg-primary" />
              )}
            </span>

            <span className="mt-2 text-xs font-medium leading-tight px-1 truncate max-w-full">
              {step.name}
            </span>

            {!compact && step.date && (
              <span className="mt-0.5 text-[10px] text-muted-foreground font-mono">
                {step.date}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
