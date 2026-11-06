import * as React from 'react';
import { Button, type ButtonProps } from '../atoms/Button';
import { Check, X } from 'lucide-react';
import { cn } from '../../infrastructure/utils';

export interface ConfirmButtonProps extends Omit<ButtonProps, 'onConfirm'> {
  onConfirm: () => void | Promise<void>;
  confirmText?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  timeoutMs?: number;
}

export const ConfirmButton = React.forwardRef<HTMLButtonElement, ConfirmButtonProps>(
  (
    {
      onConfirm,
      confirmText = 'Emin misiniz?',
      confirmLabel = 'Evet',
      cancelLabel = 'İptal',
      timeoutMs = 4000,
      children,
      variant = 'destructive',
      size = 'default',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isConfirming, setIsConfirming] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    const resetConfirmation = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsConfirming(false);
    };

    const handleInitialClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsConfirming(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsConfirming(false);
      }, timeoutMs);
    };

    const handleConfirm = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      try {
        setIsLoading(true);
        await onConfirm();
      } finally {
        setIsLoading(false);
        setIsConfirming(false);
      }
    };

    const handleCancel = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      resetConfirmation();
    };

    if (isConfirming) {
      return (
        <div className={cn('inline-flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150', className)}>
          <span className="text-xs font-semibold text-destructive px-1 select-none">
            {confirmText}
          </span>
          <Button
            type="button"
            size="xs"
            variant="destructive"
            loading={isLoading}
            onClick={handleConfirm}
            className="gap-1 h-7 px-2"
          >
            <Check className="size-3" />
            <span>{confirmLabel}</span>
          </Button>
          <Button
            type="button"
            size="xs"
            variant="ghost"
            disabled={isLoading}
            onClick={handleCancel}
            className="h-7 px-1.5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
            <span className="sr-only">{cancelLabel}</span>
          </Button>
        </div>
      );
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        onClick={handleInitialClick}
        className={className}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ConfirmButton.displayName = 'ConfirmButton';
