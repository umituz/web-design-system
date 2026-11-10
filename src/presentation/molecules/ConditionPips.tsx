import type { HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';

export interface ConditionPipsProps extends HTMLAttributes<HTMLSpanElement> {
  score: number | null | undefined;
  max?: number;
  className?: string;
  ariaLabel?: string;
}

export function ConditionPips({
  score,
  max = 5,
  className,
  ariaLabel,
  ...props
}: ConditionPipsProps) {
  const value = Math.max(0, Math.min(score ?? 0, max));
  const label = ariaLabel ?? `${value}/${max}`;

  return (
    <span
      className={cn('cond-pips', className)}
      role="img"
      aria-label={label}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={cn('pip', i < value && 'on')}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
