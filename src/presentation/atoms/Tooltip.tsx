/**
 * Tooltip Component (Atom)
 * @description Popup with additional information
 */

import { forwardRef, type HTMLAttributes, type ReactNode, useState, useRef, useEffect } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps, ChildrenProps } from '../../domain/types';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'>, BaseProps {
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const placementStyles: Record<'top' | 'bottom' | 'left' | 'right', string> = {
  top: 'bottom-full mb-2',
  bottom: 'top-full mt-2',
  left: 'right-full mr-2',
  right: 'left-full ml-2',
};

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, children, content, placement = 'top', delay = 200, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(true);
      }, delay);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsOpen(false);
    };

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
        {isOpen && (
          <div
            className={cn(
              'absolute z-50 px-2 py-1 text-xs text-white bg-foreground rounded shadow-lg whitespace-nowrap',
              placementStyles[placement],
              'animate-in fade-in-0 zoom-in-95',
              className
            )}
            role="tooltip"
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';
