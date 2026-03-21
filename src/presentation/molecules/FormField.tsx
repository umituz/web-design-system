/**
 * FormField Component (Molecule)
 * @description Label + Input combination
 */

import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import { Input } from '../atoms/Input';
import { Text } from '../atoms/Text';

export interface FormFieldProps extends BaseProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  id?: string;
  inputProps?: React.ComponentProps<typeof Input>;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, required, id, className, inputProps, ...props }, ref) => {
    const fieldId = id || inputProps?.id || inputProps?.name;
    const errorId = error ? `${fieldId}-error` : undefined;
    const helperId = helperText ? `${fieldId}-helper` : undefined;

    return (
      <div className={cn('space-y-1.5', className)} {...props}>
        {label && (
          <Text as="label" variant="label" size="sm" htmlFor={fieldId}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Text>
        )}

        <Input
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={cn(errorId, helperId)}
          error={!!error}
          {...inputProps}
        />

        {error && (
          <Text as="p" variant="caption" size="sm" id={errorId} className="text-destructive">
            {error}
          </Text>
        )}

        {helperText && !error && (
          <Text as="p" variant="caption" size="sm" id={helperId} className="text-muted-foreground">
            {helperText}
          </Text>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
