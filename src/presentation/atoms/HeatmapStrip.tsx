/**
 * HeatmapStrip Component (Atom)
 * @description Compact threshold-toned strip of cells — percent-driven color
 * and opacity ramps (skill coverage, streak calendars, activity strips).
 */

import { forwardRef } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface HeatmapCell {
  /** 0–100, or null for "no data". */
  percent: number | null;
  /** Tooltip text for the cell. */
  label?: string;
}

export interface HeatmapStripProps extends BaseProps {
  cells: readonly HeatmapCell[];
  /** >= goodAt renders success; >= lowAt renders primary; below renders destructive. */
  goodAt?: number;
  lowAt?: number;
  /** Cell height in px. */
  height?: number;
  /** Accessible name for the whole strip. */
  label?: string;
}

export const HeatmapStrip = forwardRef<HTMLDivElement, HeatmapStripProps>(
  ({ cells, goodAt = 70, lowAt = 40, height = 22, label, className }, ref) => {
    return (
      <div ref={ref} role="img" aria-label={label} className={cn('flex w-full items-stretch gap-1', className)}>
        {cells.map((cell, i) => {
          const tone =
            cell.percent === null
              ? 'var(--color-muted)'
              : cell.percent >= goodAt
                ? 'var(--color-success)'
                : cell.percent >= lowAt
                  ? 'var(--color-primary)'
                  : 'var(--color-destructive)';
          const opacity = cell.percent === null ? 1 : 0.35 + 0.65 * (cell.percent / 100);
          return (
            <span
              key={i}
              title={cell.label}
              aria-hidden="true"
              className="min-w-0 flex-1 rounded-[3px]"
              style={{ height, backgroundColor: tone, opacity }}
            />
          );
        })}
      </div>
    );
  },
);

HeatmapStrip.displayName = 'HeatmapStrip';
