/**
 * Stepper Component (Organism)
 * @description Horizontal or vertical step indicator with derived status,
 * optional click navigation and per-step override/lock control
 */

import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../infrastructure/utils';

export type StepperStepStatus = 'completed' | 'current' | 'upcoming' | 'error';

export interface StepperStep {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  status?: StepperStepStatus;
  locked?: boolean;
  optional?: boolean;
}

export interface StepperProps {
  steps: readonly StepperStep[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  onStepSelect?: (index: number) => void;
  canSelect?: (index: number) => boolean;
  ariaLabel?: string;
  className?: string;
}

function deriveStatus(step: StepperStep, index: number, currentStep: number): StepperStepStatus {
  if (step.status !== undefined) return step.status;
  if (index < currentStep) return 'completed';
  if (index === currentStep) return 'current';
  return 'upcoming';
}

const dotClasses: Record<StepperStepStatus, string> = {
  completed: 'flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground',
  current: 'flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-primary ring-4 ring-primary/15',
  error: 'flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-destructive bg-background text-destructive ring-4 ring-destructive/15',
  upcoming: 'flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground',
};

const labelClasses: Record<StepperStepStatus, string> = {
  completed: 'text-xs font-semibold text-foreground',
  current: 'text-xs font-bold text-foreground',
  error: 'text-xs font-bold text-destructive',
  upcoming: 'text-xs font-medium text-muted-foreground',
};

function StepperNode({ step, index, status }: { step: StepperStep; index: number; status: StepperStepStatus }) {
  return (
    <>
      <span className={dotClasses[status]}>
        {status === 'completed' && step.icon === undefined ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          step.icon ?? <span className="text-[11px] font-bold">{index + 1}</span>
        )}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 text-left">
        <span className={cn(labelClasses[status], 'flex items-center gap-1.5')}>
          {step.label}
          {step.optional && <span className="font-normal text-muted-foreground">(optional)</span>}
        </span>
        {step.description !== undefined && (
          <span className="text-[11px] leading-snug text-muted-foreground">{step.description}</span>
        )}
      </span>
    </>
  );
}

export function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  onStepSelect,
  canSelect,
  ariaLabel,
  className,
}: StepperProps) {
  const interactive = onStepSelect !== undefined;
  return (
    <ol
      aria-label={ariaLabel}
      className={cn(
        orientation === 'horizontal' ? 'flex w-full items-start gap-2' : 'flex w-full flex-col',
        className,
      )}
    >
      {steps.map((step, index) => {
        const status = deriveStatus(step, index, currentStep);
        const clickable =
          interactive && !step.locked && (canSelect ? canSelect(index) : index < currentStep);
        const last = index === steps.length - 1;
        return (
          <li
            key={step.id}
            aria-current={status === 'current' ? 'step' : undefined}
            className={cn(
              orientation === 'horizontal'
                ? 'flex min-w-0 flex-1 items-center gap-2'
                : cn('relative flex items-start gap-3', !last && 'pb-5'),
            )}
          >
            {orientation === 'vertical' && !last && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute bottom-1 left-3.5 top-9 w-px',
                  status === 'completed' ? 'bg-primary/60' : 'bg-border',
                )}
              />
            )}
            {clickable ? (
              <button
                type="button"
                onClick={() => onStepSelect?.(index)}
                className="flex min-w-0 cursor-pointer items-center gap-2 rounded-md p-0.5 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <StepperNode step={step} index={index} status={status} />
              </button>
            ) : (
              <div className="flex min-w-0 items-center gap-2">
                <StepperNode step={step} index={index} status={status} />
              </div>
            )}
            {orientation === 'horizontal' && !last && (
              <span
                aria-hidden="true"
                className={cn(
                  'hidden h-px min-w-4 flex-1 sm:block',
                  status === 'completed' ? 'bg-primary/60' : 'bg-border',
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
