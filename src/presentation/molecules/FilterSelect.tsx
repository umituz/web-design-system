import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value' | 'size'>,
    BaseProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly FilterSelectOption[];
  ariaLabel: string;
  allLabel: string;
}

export const FilterSelect = ({
  value,
  onChange,
  options,
  ariaLabel,
  allLabel,
  className,
  ...props
}: FilterSelectProps) => {
  return (
    <select
      aria-label={ariaLabel}
      className={cn(
        'udb-filter-select h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground',
        className
      )}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      {...props}
    >
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

FilterSelect.displayName = 'FilterSelect';
