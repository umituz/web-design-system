/**
 * CodeBlock Component (Molecule)
 * @description Syntax-highlighted code block with copy button and expand/collapse
 */

import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronDown, ChevronUp, Check, Copy } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import { TIMING } from '../../infrastructure/constants/timing.constants';
import type { BaseProps } from '../../domain/types';

export interface CodeBlockProps extends BaseProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  /** Lines threshold to enable collapse/expand. */
  collapseThreshold?: number;
}

const DEFAULT_LANGUAGE = 'javascript';
const DEFAULT_COLLAPSE_THRESHOLD = 10;
const COPY_RESET_MS = 2000;
const COLLAPSED_MAX_HEIGHT = 'max-h-80';

export const CodeBlock = ({
  children,
  language = DEFAULT_LANGUAGE,
  filename,
  showLineNumbers = false,
  collapseThreshold = DEFAULT_COLLAPSE_THRESHOLD,
  className,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), COPY_RESET_MS);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      console.error('[CodeBlock] Clipboard API not available');
      return;
    }
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
    } catch (error) {
      console.error('[CodeBlock] Failed to copy code:', error);
    }
  };

  const lineCount = children.split('\n').length;
  const isLongCode = lineCount > collapseThreshold;

  return (
    <div
      className={cn(
        'my-6 overflow-hidden rounded-lg border border-border bg-card transition-colors',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-2">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-xs font-medium text-muted-foreground">{filename}</span>
          )}
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isLongCode && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-label={isExpanded ? 'Collapse code' : 'Expand code'}
              title={isExpanded ? 'Collapse' : 'Expand'}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Code copied' : 'Copy code'}
            title={copied ? 'Copied!' : 'Copy code'}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
              copied
                ? 'border-success bg-success text-success-foreground'
                : 'border-border bg-secondary text-foreground hover:bg-muted'
            )}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className={cn(isLongCode && !isExpanded && COLLAPSED_MAX_HEIGHT, 'overflow-hidden')}>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '14px',
            background: 'transparent',
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>

      {isLongCode && !isExpanded && (
        <div className="border-t border-border bg-secondary px-4 py-2 text-center">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            aria-label={`Show all ${lineCount} lines`}
            className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Show all {lineCount} lines
          </button>
        </div>
      )}
    </div>
  );
};
