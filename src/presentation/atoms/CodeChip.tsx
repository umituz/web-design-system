import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface CodeChipProps extends BaseProps {
  children: React.ReactNode;
  copyLabel?: string;
  copiedLabel?: string;
}

export const CodeChip = ({
  children,
  className,
  copyLabel = 'Copy',
  copiedLabel = 'Copied',
}: CodeChipProps) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = () => {
    navigator.clipboard?.writeText(String(children));
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        handleCopy();
      }}
      title={copied ? copiedLabel : copyLabel}
      aria-label={copied ? copiedLabel : copyLabel}
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11.5px] text-muted-foreground transition-colors hover:border-ring hover:text-foreground',
        copied && 'text-success',
        className
      )}
    >
      {children}
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  );
};

CodeChip.displayName = 'CodeChip';
