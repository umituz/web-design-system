/**
 * CodeBlock Component (Molecule)
 * @description Syntax-highlighted code block with copy button and expand/collapse
 */

import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { BaseProps } from '../../domain/types';

export interface CodeBlockProps extends BaseProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock = ({
  children,
  language = 'javascript',
  filename,
  showLineNumbers = false,
  className,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Cleanup copy timeout
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Auto-detect language if not provided
  const detectedLanguage = language || 'javascript';

  // Check if code is long enough for collapse
  const lineCount = children.split('\n').length;
  const isLongCode = lineCount > 10;

  return (
    <div className={`my-6 rounded-lg border border-border overflow-hidden bg-bg-card transition-theme ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-tertiary border-b border-border">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-xs font-medium text-text-secondary">{filename}</span>
          )}
          <span className="text-xs px-2 py-1 bg-bg-primary text-text-primary rounded-md font-medium">
            {detectedLanguage}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isLongCode && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-text-secondary hover:text-text-primary rounded transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
              type="button"
              aria-label={isExpanded ? 'Collapse code' : 'Expand code'}
            >
              {isExpanded ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
            </button>
          )}

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary border border-border'
            }`}
            title={copied ? 'Copied!' : 'Copy code'}
            type="button"
            aria-label={copied ? 'Code copied' : 'Copy code'}
          >
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code */}
      <div className={isLongCode && !isExpanded ? 'max-h-80 overflow-hidden' : ''}>
        <SyntaxHighlighter
          language={detectedLanguage}
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

      {/* Expand hint for collapsed code */}
      {isLongCode && !isExpanded && (
        <div className="px-4 py-2 bg-bg-secondary text-center border-t border-border">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm text-primary-light hover:underline font-medium"
            type="button"
            aria-label={`Show all ${lineCount} lines`}
          >
            Show all {lineCount} lines
          </button>
        </div>
      )}
    </div>
  );
};
