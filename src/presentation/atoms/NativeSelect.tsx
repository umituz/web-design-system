import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface NativeSelectOption {
  value: string;
  label: string;
}

export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>, BaseProps {
  error?: boolean | string;
  hint?: ReactNode;
  label?: ReactNode;
  fullWidth?: boolean;
  options?: readonly NativeSelectOption[];
  onValueChange?: (value: string) => void;
}

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, error, hint, label, id, children, options, fullWidth = true, onValueChange, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const hasError = Boolean(error);
    const errorText = typeof error === 'string' && error.length > 0 ? error : undefined;
    const hintId = `${selectId}-hint`;
    const control = (
      <div className={cn('relative', fullWidth && 'w-full')}>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={hasError || undefined}
          aria-describedby={hint !== undefined || errorText !== undefined ? hintId : undefined}
          className={cn(
            'flex h-9 w-full appearance-none rounded-md border bg-background px-3 pr-8 text-sm',
            'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            hasError ? 'border-destructive' : 'border-input',
            className
          )}
          {...props}
          onChange={(event) => {
            props.onChange?.(event);
            onValueChange?.(event.currentTarget.value);
          }}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    );
    if (label === undefined && hint === undefined && !errorText) {
      return control;
    }
    return (
      <div className={cn(fullWidth && 'w-full')}>
        {label !== undefined && (
          <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium">
            {label}
          </label>
        )}
        {control}
        {(errorText !== undefined || hint !== undefined) && (
          <p id={hintId} className={cn('mt-1.5 text-xs', errorText ? 'text-destructive' : 'text-muted-foreground')}>
            {errorText ?? hint}
          </p>
        )}
      </div>
    );
  }
);

NativeSelect.displayName = 'NativeSelect';
