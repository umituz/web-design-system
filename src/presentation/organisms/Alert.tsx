/**
 * Alert Component (Organism)
 * @description Feedback message with icon
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps, ChildrenProps, ColorVariant } from '../../domain/types';
import { Icon } from '../atoms/Icon';

export type AlertVariant = Extract<ColorVariant, 'success' | 'warning' | 'destructive'> | 'info';

export interface AlertProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  variant?: AlertVariant;
  showIcon?: boolean;
}

const variantStyles: Record<AlertVariant, { container: string; iconColor: string }> = {
  success: {
    container: 'border-success bg-success/10 text-success',
    iconColor: 'text-success',
  },
  warning: {
    container: 'border-warning bg-warning/10 text-warning',
    iconColor: 'text-warning',
  },
  destructive: {
    container: 'border-destructive bg-destructive/10 text-destructive',
    iconColor: 'text-destructive',
  },
  info: {
    container: 'border-primary bg-primary/10 text-primary',
    iconColor: 'text-primary',
  },
};

const icons: Record<AlertVariant, React.ReactNode> = {
  success: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  warning: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  ),
  destructive: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
    />
  ),
  info: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    />
  ),
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', showIcon = true, children, ...props }, ref) => {
    const styles = variantStyles[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative w-full rounded-lg border p-4',
          styles.container,
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          {showIcon && (
            <Icon className={cn('shrink-0 mt-0.5', styles.iconColor)} size="sm">
              {icons[variant]}
            </Icon>
          )}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
