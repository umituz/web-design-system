/**
 * List Template (Template)
 * @description Structured list container
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface ListProps extends HTMLAttributes<HTMLUListElement>, BaseProps {
  variant?: 'default' | 'bordered' | 'spaced';
}

const variantStyles: Record<'default' | 'bordered' | 'spaced', string> = {
  default: '',
  bordered: 'divide-y divide-border',
  spaced: 'space-y-2',
};

export const List = forwardRef<HTMLUListElement, ListProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {children}
      </ul>
    );
  }
);

List.displayName = 'List';

export const ListItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn('py-2', className)}
      {...props}
    />
  )
);

ListItem.displayName = 'ListItem';
