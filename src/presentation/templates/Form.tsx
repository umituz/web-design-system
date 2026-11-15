
import { forwardRef, type FormHTMLAttributes, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement>, BaseProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className, onSubmit, children, ...props }, ref) => {
    return (
      <form
        ref={ref}
        onSubmit={onSubmit}
        className={cn('space-y-4', className)}
        {...props}
      >
        {children}
      </form>
    );
  }
);

Form.displayName = 'Form';

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  sticky?: boolean;
}

export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, sticky = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-2 justify-end',
        sticky && 'sticky bottom-0 z-10 bg-background/95 pt-3 pb-1 backdrop-blur',
        className
      )}
      {...props}
    />
  )
);

FormActions.displayName = 'FormActions';
