
import { forwardRef, type HTMLAttributes } from 'react';
import { formatMoney } from '../../infrastructure/utils';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface MoneyProps extends HTMLAttributes<HTMLSpanElement>, BaseProps {
  amountMinor: number;
  currency: string;
  locale?: string;
}

export const Money = forwardRef<HTMLSpanElement, MoneyProps>(
  ({ amountMinor, currency, locale = 'en-US', className, ...props }, ref) => (
    <span ref={ref} className={cn('tabular-nums', className)} {...props}>
      {formatMoney(amountMinor, currency, locale)}
    </span>
  )
);

Money.displayName = 'Money';
