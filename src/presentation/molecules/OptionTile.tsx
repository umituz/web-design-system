
import { forwardRef } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export type OptionTileState = 'correct' | 'wrong' | 'missed';

export interface OptionTileProps extends BaseProps {
  label: React.ReactNode;
  keyBadge?: string;
  type?: 'radio' | 'checkbox';
  checked?: boolean;
  state?: OptionTileState;
  disabled?: boolean;
  name?: string;
  onChange: (checked: boolean) => void;
}

export const OptionTile = forwardRef<HTMLLabelElement, OptionTileProps>(
  ({ label, keyBadge, type = 'radio', checked = false, state, disabled = false, name, onChange, className }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg border bg-card px-4 py-3 text-left text-sm transition-colors',
          'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2',
          !state && (checked ? 'cursor-pointer border-primary bg-primary/10' : 'cursor-pointer border-border hover:border-primary/50'),
          !state && disabled && 'cursor-not-allowed opacity-60',
          state === 'correct' && 'border-success bg-success/10',
          state === 'wrong' && 'border-destructive bg-destructive/10',
          state === 'missed' && 'border-border opacity-60',
          state && 'cursor-not-allowed',
          className,
        )}
      >
        <input
          type={type}
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        {keyBadge && (
          <span
            aria-hidden="true"
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-muted font-mono text-xs font-medium text-muted-foreground"
          >
            {keyBadge}
          </span>
        )}
        <span className="flex-1">{label}</span>
        {state === 'correct' && <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />}
        {state === 'wrong' && <X className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />}
      </label>
    );
  },
);

OptionTile.displayName = 'OptionTile';
