import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';

interface FieldControlProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

export interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  htmlFor?: string;
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, required, htmlFor, hideLabel = false, className, children }: FieldProps) {
  const autoId = useId();
  const childId = isValidElement(children) ? (children as ReactElement<FieldControlProps>).props.id : undefined;
  const controlId = childId ?? htmlFor ?? autoId;
  const hintId = hint !== undefined ? `${autoId}-hint` : undefined;
  const errorId = error !== undefined ? `${autoId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('block', className)}>
      {label !== undefined && (
        <label htmlFor={controlId} className={cn('mb-1 block text-sm font-medium', hideLabel && 'sr-only')}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
      )}
      {isValidElement(children)
        ? cloneElement(children as ReactElement<FieldControlProps>, {
            id: controlId,
            'aria-describedby': describedBy,
            'aria-invalid': error !== undefined ? true : undefined,
          })
        : children}
      {error !== undefined && <span className="mt-1 block text-xs text-destructive">{error}</span>}
      {error === undefined && hint !== undefined && <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{hint}</span>}
    </div>
  );
}
