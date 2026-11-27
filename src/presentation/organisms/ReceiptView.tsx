import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';

export interface ReceiptLineItem {
  id: string;
  name: ReactNode;
  quantity: number;
  total: ReactNode;
  unitPrice?: ReactNode;
  sku?: ReactNode;
}

export interface ReceiptMetaField {
  label: ReactNode;
  value: ReactNode;
}

export interface ReceiptViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  meta?: readonly ReceiptMetaField[];
  lines: readonly ReceiptLineItem[];
  subtotal?: ReactNode;
  discount?: ReactNode;
  tax?: ReactNode;
  total: ReactNode;
  code?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function ReceiptView({
  title,
  subtitle,
  meta,
  lines,
  subtotal,
  discount,
  tax,
  total,
  code,
  footer,
  className,
  ...rest
}: ReceiptViewProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-sm rounded-lg border border-border bg-card p-5 font-mono text-xs text-card-foreground shadow-xs',
        className,
      )}
      {...rest}
    >
      {(title || subtitle) && (
        <div className="mb-4 text-center">
          {title && <h2 className="text-sm font-bold text-foreground">{title}</h2>}
          {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      )}

      {meta && meta.length > 0 && (
        <div className="mb-3 space-y-0.5 border-b border-border/60 pb-3 text-[11px] text-muted-foreground">
          {meta.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.label}</span>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mb-3 space-y-1.5 border-b border-border/60 pb-3">
        {lines.map((line) => (
          <div key={line.id} className="flex items-baseline justify-between gap-2">
            <div className="min-w-0 flex-1 truncate">
              <span className="font-semibold text-foreground">{line.name}</span>
              <div className="text-[10px] text-muted-foreground">
                <span>{line.quantity} × {line.unitPrice}</span>
                {line.sku && <span className="ml-1.5">#{line.sku}</span>}
              </div>
            </div>
            <span className="font-semibold text-foreground shrink-0">{line.total}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 border-b border-border/60 pb-3 text-xs">
        {subtotal && (
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{subtotal}</span>
          </div>
        )}
        {discount && (
          <div className="flex justify-between text-success font-medium">
            <span>Discount</span>
            <span>-{discount}</span>
          </div>
        )}
        {tax && (
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span>{tax}</span>
          </div>
        )}
        <div className="mt-2 flex justify-between pt-1 text-sm font-bold text-foreground border-t border-border">
          <span>Total</span>
          <span>{total}</span>
        </div>
      </div>

      {code && (
        <div className="my-3 text-center">
          <div className="inline-block rounded-sm bg-muted px-3 py-1 tracking-widest text-xs font-semibold text-foreground">
            {code}
          </div>
        </div>
      )}

      {footer && (
        <div className="mt-3 text-center text-[10px] text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
