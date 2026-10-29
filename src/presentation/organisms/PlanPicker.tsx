/**
 * PlanPicker Component (Organism)
 * @description Pricing plan card group with an optional billing cycle switch;
 * money stays caller-computed — price and features are plain nodes
 */

import type { KeyboardEvent, ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import { Button } from '../atoms/Button';
import { Segmented } from '../molecules/Segmented';

export interface PlanPickerCycle<T extends string = string> {
  value: T;
  label: ReactNode;
  hint?: ReactNode;
}

export interface PlanPickerPlan {
  id: string;
  name: ReactNode;
  badge?: ReactNode;
  description?: ReactNode;
  price: ReactNode;
  priceNote?: ReactNode;
  meta?: ReactNode;
  features?: ReactNode[];
  current?: boolean;
  highlight?: boolean;
  ctaLabel?: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface PlanPickerProps<T extends string = string> {
  plans: readonly PlanPickerPlan[];
  cycle?: T;
  cycles?: readonly PlanPickerCycle<T>[];
  onCycleChange?: (value: T) => void;
  selectedId?: string;
  onPlanSelect?: (id: string) => void;
  busy?: boolean;
  columns?: 2 | 3 | 4;
  className?: string;
}

const gridColumns: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

function PlanCard({
  plan,
  selected,
  selectable,
  busy,
  onSelect,
}: {
  plan: PlanPickerPlan;
  selected: boolean;
  selectable: boolean;
  busy: boolean;
  onSelect: (id: string) => void;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (selectable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onSelect(plan.id);
    }
  };
  return (
    <article
      role={selectable ? 'radio' : undefined}
      aria-checked={selectable ? selected : undefined}
      tabIndex={selectable ? 0 : undefined}
      onClick={() => selectable && onSelect(plan.id)}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex flex-col gap-4 rounded-xl border bg-card p-5 text-left transition',
        plan.highlight ? 'border-2 border-primary shadow-lg shadow-primary/5' : 'border-border',
        selected && !plan.highlight && 'border-primary bg-primary/5',
        plan.current && 'bg-muted/30',
        selectable && 'cursor-pointer hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
    >
      {plan.badge !== undefined && (
        <span
          className={cn(
            'absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-xs',
            plan.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
          )}
        >
          {plan.badge}
        </span>
      )}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{plan.name}</span>
        <span className="flex flex-wrap items-baseline gap-1">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">{plan.price}</span>
          {plan.priceNote !== undefined && (
            <span className="text-xs text-muted-foreground">{plan.priceNote}</span>
          )}
        </span>
        {plan.description !== undefined && (
          <p className="text-xs text-muted-foreground">{plan.description}</p>
        )}
      </div>
      {plan.meta !== undefined && (
        <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-2.5 py-2 text-xs text-muted-foreground">
          {plan.meta}
        </div>
      )}
      {plan.features !== undefined && plan.features.length > 0 && (
        <ul className="flex flex-col gap-2 text-xs text-foreground/80">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-1">
        {plan.current ? (
          <div
            aria-disabled="true"
            className="w-full rounded-lg bg-success/10 px-3 py-2 text-center text-xs font-semibold text-success"
          >
            {plan.ctaLabel ?? 'Current plan'}
          </div>
        ) : (
          <Button
            variant={plan.highlight ? 'primary' : 'secondary'}
            size="sm"
            block
            disabled={plan.disabled}
            loading={busy}
            onClick={(event) => {
              event.stopPropagation();
              plan.onSelect?.();
            }}
          >
            {plan.ctaLabel ?? 'Select'}
          </Button>
        )}
      </div>
    </article>
  );
}

export function PlanPicker<T extends string = string>({
  plans,
  cycle,
  cycles,
  onCycleChange,
  selectedId,
  onPlanSelect,
  busy = false,
  columns = 3,
  className,
}: PlanPickerProps<T>) {
  const showCycles = cycles !== undefined && cycles.length > 0 && cycle !== undefined && onCycleChange !== undefined;
  return (
    <div className={className}>
      {showCycles && (
        <div className="mb-5 flex justify-center">
          <Segmented
            aria-label="Billing cycle"
            options={cycles.map((entry) => ({
              value: entry.value,
              label: (
                <span className="flex items-center gap-1.5">
                  {entry.label}
                  {entry.hint !== undefined && (
                    <span className="rounded bg-success/15 px-1 py-0.5 text-[10px] font-bold text-success">
                      {entry.hint}
                    </span>
                  )}
                </span>
              ),
            }))}
            value={cycle}
            onChange={onCycleChange}
          />
        </div>
      )}
      <div className={cn('grid gap-4', gridColumns[columns])}>
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={selectedId === plan.id}
            selectable={onPlanSelect !== undefined && !plan.current && !plan.disabled}
            busy={busy}
            onSelect={onPlanSelect ?? (() => {})}
          />
        ))}
      </div>
    </div>
  );
}
