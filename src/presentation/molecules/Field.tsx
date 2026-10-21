import type { ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';

export interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, required, htmlFor, className, children }: FieldProps) {
  return (
    <div className={cn('block', className)}>
      {label !== undefined && (
        <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
      )}
      {children}
      {error !== undefined && <span className="mt-1 block text-xs text-destructive">{error}</span>}
      {error === undefined && hint !== undefined && <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{hint}</span>}
    </div>
  );
}
