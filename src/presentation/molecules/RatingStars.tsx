/**
 * RatingStars Component (Molecule)
 * @description 0–5 rating with visual half-star precision, numeric value and
 *   optional review count
 */

import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface RatingStarsProps extends BaseProps {
  /** 0–5 rating; halves render as partial star fills. */
  value: number;
  /** Optional review count rendered in parentheses. */
  count?: number;
  /** Locale-formatted count override (e.g. 1,204). */
  formatCount?: (count: number) => string;
  size?: 'sm' | 'md';
}

const STAR_PATH =
  'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.45 4.73L5.82 21z';

function StarShape({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" style={{ flex: 'none' }}>
      <path d={STAR_PATH} />
    </svg>
  );
}

export function RatingStars({ value, count, formatCount, size = 'sm', className }: RatingStarsProps) {
  const clamped = Math.min(5, Math.max(0, value));
  const starSize = size === 'sm' ? 13 : 16;
  const countText = count !== undefined ? `(${formatCount ? formatCount(count) : count})` : null;
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span aria-hidden="true" className="inline-flex gap-px text-muted-foreground/40">
        {[0, 1, 2, 3, 4].map((index) => {
          const fill = Math.min(1, Math.max(0, clamped - index));
          return (
            <span key={index} className="relative inline-flex">
              <StarShape size={starSize} />
              {fill > 0 && (
                <span className="absolute inset-0 overflow-hidden text-warning" style={{ width: `${fill * 100}%` }}>
                  <StarShape size={starSize} />
                </span>
              )}
            </span>
          );
        })}
      </span>
      <span className="text-sm font-semibold tabular-nums">{value.toFixed(1)}</span>
      {countText !== null && <span className="text-xs text-muted-foreground">{countText}</span>}
      <span className="sr-only">
        Rated {value.toFixed(1)} out of 5{count !== undefined ? ` from ${count} reviews` : ''}
      </span>
    </span>
  );
}
