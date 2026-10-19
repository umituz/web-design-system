/**
 * StatusBadge Component (Organism)
 * @description Vocab-driven status badge — resolves a raw value against a
 *   status map (label + tone), falling back to a neutral badge with the
 *   raw value as its label.
 */

import { Badge } from '../atoms/Badge';
import type { BadgeVariant } from '../atoms/Badge';

export interface StatusEntry {
  label: string;
  tone?: BadgeVariant;
  dot?: boolean;
}

export type StatusVocab = Record<string, StatusEntry>;

export interface StatusBadgeProps {
  vocab: StatusVocab;
  value: string;
  dot?: boolean;
  mono?: boolean;
  className?: string;
}

export function StatusBadge({ vocab, value, dot, mono = true, className }: StatusBadgeProps) {
  const entry: StatusEntry | undefined = vocab[value];
  return (
    <Badge tone={entry?.tone ?? 'neutral'} dot={dot ?? entry?.dot ?? true} mono={mono} className={className}>
      {entry?.label ?? value}
    </Badge>
  );
}
