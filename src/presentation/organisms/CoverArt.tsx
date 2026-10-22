/**
 * CoverArt Component (Organism)
 * @description Deterministic generated artwork for entities without
 *   photography — the seed always resolves to the same gradient, replaced by
 *   real imagery once a media service exists
 */

import type { ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import { hashSeed } from '../../infrastructure/utils/hash.util';
import type { BaseProps } from '../../domain/types';

export interface CoverArtProps extends BaseProps {
  /** Any stable entity id/name — the same seed always renders the same gradient. */
  seed: string;
  ratio?: '16/9' | '3/2' | '4/3' | '1/1' | '21/9';
  rounded?: 'none' | 'md' | 'lg' | 'top';
  /** Brand palette override ([from, to]); wins over the seeded gradient. */
  colors?: readonly [string, string];
  /** Accessible description; omit for purely decorative usage. */
  alt?: string;
  children?: ReactNode;
}

const GRADIENTS: readonly [string, string][] = [
  ['#f59e0b', '#ef4444'],
  ['#10b981', '#0ea5e9'],
  ['#8b5cf6', '#ec4899'],
  ['#f97316', '#eab308'],
  ['#06b6d4', '#3b82f6'],
  ['#84cc16', '#14b8a6'],
  ['#f43f5e', '#a855f7'],
  ['#64748b', '#1e293b'],
];

const ratioStyles: Record<NonNullable<CoverArtProps['ratio']>, string> = {
  '16/9': 'aspect-video',
  '3/2': 'aspect-[3/2]',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '21/9': 'aspect-[21/9]',
};

const roundedStyles: Record<NonNullable<CoverArtProps['rounded']>, string> = {
  none: 'rounded-none',
  md: 'rounded-md',
  lg: 'rounded-lg',
  top: 'rounded-t-lg rounded-b-none',
};

export function CoverArt({ seed, ratio = '16/9', rounded = 'md', colors, alt, children, className }: CoverArtProps) {
  const [from, to] = colors ?? GRADIENTS[hashSeed(seed) % GRADIENTS.length]!;
  return (
    <div
      className={cn('relative flex w-full items-end overflow-hidden', ratioStyles[ratio], roundedStyles[rounded], className)}
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
      role={alt !== undefined ? 'img' : undefined}
      aria-label={alt}
      aria-hidden={alt === undefined ? true : undefined}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 15% 10%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 55%), radial-gradient(140% 110% at 85% 95%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 60%)',
        }}
      />
      {children !== undefined && <div className="relative z-[1] w-full">{children}</div>}
    </div>
  );
}
