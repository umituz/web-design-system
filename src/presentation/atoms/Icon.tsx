/**
 * Icon Component (Atom)
 * @description Wrapper for SVG icons
 */

import { forwardRef, type SVGAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import type { ExtendedSizes } from '../../infrastructure/constants';

export interface IconProps extends SVGAttributes<SVGSVGElement>, BaseProps {
  size?: ExtendedSizes;
}

const sizeStyles: Record<ExtendedSizes, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-10 w-10',
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ className, size = 'md', viewBox = '0 0 24 24', fill = 'none', xmlns = 'http://www.w3.org/2000/svg', ...props }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox={viewBox}
        fill={fill}
        xmlns={xmlns}
        className={cn('inline-block shrink-0', sizeStyles[size], className)}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';
