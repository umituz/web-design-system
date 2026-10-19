import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface OptionCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'>,
    BaseProps {
  label: string;
  description?: string;
  icon?: ReactNode;
  selected?: boolean;
  multiSelect?: boolean;
  onSelect: () => void;
}

export const OptionCard = forwardRef<HTMLButtonElement, OptionCardProps>(
  (
    { label, description, icon, selected = false, multiSelect = false, onSelect, className, type, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        role={multiSelect ? 'checkbox' : 'radio'}
        aria-checked={selected}
        onClick={onSelect}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          selected
            ? 'border-primary bg-primary/10'
            : 'border-border bg-card hover:border-primary/50',
          className,
        )}
        {...props}
      >
        {icon && (
          <span
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg [&_svg]:size-5',
              selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
            )}
          >
            {icon}
          </span>
        )}
        <span className="flex flex-1 flex-col">
          <span className="text-base font-medium">{label}</span>
          {description && <span className="text-sm text-muted-foreground">{description}</span>}
        </span>
        <span
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
            selected
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border',
          )}
          aria-hidden="true"
        >
          {selected && (
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 6 L5 9 L10 3" />
            </svg>
          )}
        </span>
      </button>
    );
  },
);

OptionCard.displayName = 'OptionCard';
