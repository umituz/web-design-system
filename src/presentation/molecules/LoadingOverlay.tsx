import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import { Spinner } from '../atoms/Spinner';
import type { BaseProps } from '../../domain/types';
import type { RegularSizes } from '../../infrastructure/constants';

export interface LoadingOverlayProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    BaseProps {
  visible: boolean;
  message?: string;
  spinnerSize?: RegularSizes;
}

export const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ visible, message, spinnerSize = 'lg', className, ...props }, ref) => {
    if (!visible) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={cn(
          'fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/80 p-6 backdrop-blur-sm',
          className
        )}
        {...props}
      >
        <Spinner size={spinnerSize} aria-hidden="true" />
        {message !== undefined ? (
          <p className="text-foreground text-sm font-medium">{message}</p>
        ) : null}
      </div>
    );
  }
);

LoadingOverlay.displayName = 'LoadingOverlay';
