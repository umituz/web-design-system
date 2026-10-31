import { Fragment, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface MarkdownTextProps extends BaseProps {
  children: string;
}

const INLINE_PATTERN =
  /(\*\*([^*]+)\*\*)|(\*([^*\n]+)\*)|(`([^`\n]+)`)|(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))/g;

const FENCE_OPEN = /^```/;
const HEADING_PATTERN = /^(#{1,3})\s+(.*)$/;
const UNORDERED_ITEM = /^[-•]\s+(.*)$/;
const ORDERED_ITEM = /^\d+[.)]\s+(.*)$/;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  let seq = 0;
  INLINE_PATTERN.lastIndex = 0;

  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index));
    }
    const key = `${keyPrefix}-i${seq++}`;
    if (match[2] !== undefined) {
      nodes.push(<strong key={key}>{match[2]}</strong>);
    } else if (match[4] !== undefined) {
      nodes.push(<em key={key}>{match[4]}</em>);
    } else if (match[6] !== undefined) {
      nodes.push(
        <code key={key} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
          {match[6]}
        </code>
      );
    } else if (match[8] !== undefined && match[9] !== undefined) {
      nodes.push(
        <a
          key={key}
          href={match[9]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-2"
        >
          {match[8]}
        </a>
      );
    }
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }
  return nodes;
}

function renderParagraphLines(lines: string[], key: string): ReactNode {
  return (
    <p key={key}>
      {lines.map((line, index) => (
        <Fragment key={`${key}-l${index}`}>
          {index > 0 && <br />}
          {renderInline(line, `${key}-l${index}`)}
        </Fragment>
      ))}
    </p>
  );
}

export const MarkdownText = ({ children, className }: MarkdownTextProps) => {
  const lines = children.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let index = 0;
  let seq = 0;

  while (index < lines.length) {
    const line = lines[index] ?? '';

    if (line.trim().length === 0) {
      index += 1;
      continue;
    }

    if (FENCE_OPEN.test(line.trim())) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !FENCE_OPEN.test((lines[index] ?? '').trim())) {
        codeLines.push(lines[index] ?? '');
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre
          key={`b${seq++}`}
          className="overflow-x-auto rounded-lg border border-border bg-card p-3 font-mono text-xs leading-relaxed"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    const headingMatch = HEADING_PATTERN.exec(line);
    if (headingMatch) {
      const level = headingMatch[1]?.length ?? 3;
      const content = headingMatch[2] ?? '';
      const key = `b${seq++}`;
      if (level === 1) {
        blocks.push(<h3 key={key} className="text-base font-semibold">{renderInline(content, key)}</h3>);
      } else if (level === 2) {
        blocks.push(<h4 key={key} className="text-sm font-semibold">{renderInline(content, key)}</h4>);
      } else {
        blocks.push(<h5 key={key} className="text-xs font-semibold uppercase tracking-wide">{renderInline(content, key)}</h5>);
      }
      index += 1;
      continue;
    }

    if (UNORDERED_ITEM.test(line)) {
      const items: string[] = [];
      while (index < lines.length && UNORDERED_ITEM.test(lines[index] ?? '')) {
        items.push((UNORDERED_ITEM.exec(lines[index] ?? '')?.[1] ?? '').trim());
        index += 1;
      }
      blocks.push(
        <ul key={`b${seq++}`} className="list-disc space-y-1 pl-5">
          {items.map((item, itemIndex) => (
            <li key={`li${itemIndex}`}>{renderInline(item, `b${seq}-li${itemIndex}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (ORDERED_ITEM.test(line)) {
      const items: string[] = [];
      while (index < lines.length && ORDERED_ITEM.test(lines[index] ?? '')) {
        items.push((ORDERED_ITEM.exec(lines[index] ?? '')?.[1] ?? '').trim());
        index += 1;
      }
      blocks.push(
        <ol key={`b${seq++}`} className="list-decimal space-y-1 pl-5">
          {items.map((item, itemIndex) => (
            <li key={`li${itemIndex}`}>{renderInline(item, `b${seq}-li${itemIndex}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      (lines[index] ?? '').trim().length > 0 &&
      !FENCE_OPEN.test((lines[index] ?? '').trim()) &&
      !HEADING_PATTERN.test(lines[index] ?? '') &&
      !UNORDERED_ITEM.test(lines[index] ?? '') &&
      !ORDERED_ITEM.test(lines[index] ?? '')
    ) {
      paragraphLines.push(lines[index] ?? '');
      index += 1;
    }
    blocks.push(renderParagraphLines(paragraphLines, `b${seq++}`));
  }

  return <div className={cn('space-y-3 text-sm leading-relaxed', className)}>{blocks}</div>;
};
