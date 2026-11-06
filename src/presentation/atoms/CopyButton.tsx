import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import { useClipboard } from '../hooks/useClipboard';

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  label?: string;
  copiedLabel?: string;
  variant?: 'outline' | 'ghost' | 'secondary' | 'default';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onCopySuccess?: (text: string) => void;
}

const sizeStyles = {
  xs: 'h-6 px-2 text-xs gap-1 [&_svg]:size-3',
  sm: 'h-8 px-2.5 text-xs gap-1.5 [&_svg]:size-3.5',
  md: 'h-9 px-3 text-sm gap-2 [&_svg]:size-4',
  lg: 'h-10 px-4 text-sm gap-2 [&_svg]:size-4',
};

const iconOnlySizeStyles = {
  xs: 'h-6 w-6 p-0 [&_svg]:size-3',
  sm: 'h-8 w-8 p-0 [&_svg]:size-3.5',
  md: 'h-9 w-9 p-0 [&_svg]:size-4',
  lg: 'h-10 w-10 p-0 [&_svg]:size-4',
};

const variantStyles = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
};

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      text,
      label = 'Kopyala',
      copiedLabel = 'Kopyalandı',
      variant = 'outline',
      size = 'sm',
      showLabel = false,
      className,
      onClick,
      onCopySuccess,
      ...props
    },
    ref
  ) => {
    const { copied, copy } = useClipboard();

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      const success = await copy(text);
      if (success) {
        onCopySuccess?.(text);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label={copied ? copiedLabel : label}
        title={copied ? copiedLabel : label}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shrink-0 select-none',
          showLabel ? sizeStyles[size] : iconOnlySizeStyles[size],
          variantStyles[variant],
          copied && 'text-emerald-600 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20',
          className
        )}
        onClick={handleCopy}
        {...props}
      >
        {copied ? (
          <Check className="shrink-0 transition-transform duration-200 scale-110" />
        ) : (
          <Copy className="shrink-0" />
        )}
        {showLabel && (
          <span>{copied ? copiedLabel : label}</span>
        )}
      </button>
    );
  }
);

CopyButton.displayName = 'CopyButton';
