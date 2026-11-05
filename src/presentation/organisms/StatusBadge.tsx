
import type { ReactNode } from 'react';
import { Badge } from '../atoms/Badge';
import type { BadgeVariant } from '../atoms/Badge';

export interface StatusEntry {
  label: string;
  tone?: BadgeVariant;
  dot?: boolean;
}

export type StatusVocab = Record<string, StatusEntry>;

export function statusVocab(
  labels: Record<string, string>,
  tones: Record<string, BadgeVariant> = {},
): StatusVocab {
  const vocab: StatusVocab = {};
  for (const [value, label] of Object.entries(labels)) {
    vocab[value] = tones[value] !== undefined ? { label, tone: tones[value] } : { label };
  }
  return vocab;
}

export interface StatusBadgeProps {
  vocab: StatusVocab;
  value: string;
  label?: ReactNode;
  dot?: boolean;
  mono?: boolean;
  className?: string;
}

export function StatusBadge({ vocab, value, label, dot, mono = false, className }: StatusBadgeProps) {
  const entry: StatusEntry | undefined = vocab[value];
  return (
    <Badge tone={entry?.tone ?? 'neutral'} dot={dot ?? entry?.dot ?? true} mono={mono} className={className}>
      {label ?? entry?.label ?? value}
    </Badge>
  );
}
