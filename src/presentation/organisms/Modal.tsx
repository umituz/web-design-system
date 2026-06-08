/**
 * Modal Component (Organism)
 * @description Dialog/overlay container with optimized transitions
 */

import { forwardRef, type HTMLAttributes, type MouseEvent, useEffect, useState, useRef } from 'react';
import { memo } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import { TIMING } from '../../infrastructure/constants/timing.constants';
import type { BaseProps } from '../../domain/types';

export interface ModalProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  open?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeStyles: Record<'sm' | 'md' | 'lg' | 'xl' | 'full', string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

export const Modal = memo(forwardRef<HTMLDivElement, ModalProps>(
  ({ open = false, onClose, showCloseButton = true, size = 'md', className, children, ...props }, ref) => {
    const [shouldRender, setShouldRender] = useState(open);
    const [isAnimating, setIsAnimating] = useState(false);
    const rafRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
      if (open) {
        setShouldRender(true);
        rafRef.current = requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      } else {
        setIsAnimating(false);
        // Wait for the fade-out animation to finish before unmounting
        timerRef.current = window.setTimeout(() => {
          setShouldRender(false);
        }, TIMING.MODAL_FADE_OUT_MS);
      }

      return () => {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }, [open]);

    if (!shouldRender) return null;

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === event.currentTarget && onClose) {
        onClose();
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        {...props}
      >
        <div
          className={cn(
            'fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-200',
            isAnimating ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        <div
          ref={ref}
          className={cn(
            'relative z-50 w-full rounded-lg border bg-card p-6 shadow-lg',
            'transition-all duration-200',
            isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            sizeStyles[size],
            className
          )}
          role="dialog"
          aria-modal="true"
        >
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          {children}
        </div>
      </div>
    );
  }
));

Modal.displayName = 'Modal';

export const ModalHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
      {...props}
    />
  )
);

ModalHeader.displayName = 'ModalHeader';

export const ModalTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);

ModalTitle.displayName = 'ModalTitle';

export const ModalDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);

ModalDescription.displayName = 'ModalDescription';

export const ModalContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-4', className)} {...props} />
  )
);

ModalContent.displayName = 'ModalContent';

export const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className
      )}
      {...props}
    />
  )
);

ModalFooter.displayName = 'ModalFooter';
