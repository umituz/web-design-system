import { useState } from 'react';
import { seriesColor } from './utils';

export interface BarSeries {
  key?: string;
  label: string;
  values?: readonly number[];
  data?: readonly number[];
  tone?: string;
  color?: string;
  accents?: readonly (string | undefined)[];
}

export interface BarChartGoalLine {
  value: number;
  label?: string;
  tone?: string;
}

export interface BarChartProps {
  labels: readonly string[];
  series: BarSeries[];
  stacking?: 'grouped' | 'stacked';
  totalLabel?: string;
  height?: number;
  formatValue?: (v: number) => string;
  formatLabel?: (l: string) => string;
  goalLine?: BarChartGoalLine;
  goalLines?: readonly BarChartGoalLine[];
}

export function BarChart({
  labels,
  series,
  stacking = 'grouped',
  totalLabel = 'Σ',
  height = 130,
  formatValue = (v: number) => String(v),
  formatLabel = (l: string) => l,
  goalLine,
  goalLines,
}: BarChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const vals = (s: BarSeries) => s.values ?? s.data ?? [];
  const goals = goalLines ?? (goalLine !== undefined ? [goalLine] : []);
  const columnTotals = labels.map((_, i) => series.reduce((sum, s) => sum + (vals(s)[i] ?? 0), 0));
  const max =
    stacking === 'stacked'
      ? Math.max(1, ...columnTotals, ...goals.map((g) => g.value))
      : Math.max(1, ...series.flatMap((s) => vals(s)), ...goals.map((g) => g.value));
  const toneOf = (s: BarSeries, i: number) => s.tone ?? s.color ?? seriesColor(i);
  const accentOf = (s: BarSeries, si: number, i: number) => s.accents?.[i] ?? toneOf(s, si);
  return (
    <div className="udb-barchart" style={{ height }}>
      {goals.map((goal) => (
        <div
          key={`${goal.value}-${goal.label ?? ''}`}
          className="udb-barchart__goal"
          style={{
            bottom: `${Math.min(100, (goal.value / max) * 100)}%`,
            ...(goal.tone !== undefined ? { borderTopColor: goal.tone } : {}),
          }}
          title={goal.label ?? formatValue(goal.value)}
          aria-hidden="true"
        >
          {goal.label !== undefined && (
            <span
              className="udb-barchart__goallabel"
              style={
                goal.tone !== undefined
                  ? { color: goal.tone, borderColor: goal.tone }
                  : undefined
              }
            >
              {goal.label}
            </span>
          )}
        </div>
      ))}
      {labels.map((label, i) => (
        <div
          key={label}
          className="udb-barchart__col"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
        >
          {stacking === 'stacked' ? (
            <div className="udb-barchart__bars udb-barchart__bars--stacked">
              {series.map((s, si) => {
                const v = vals(s)[i] ?? 0;
                return (
                  <div
                    key={s.key ?? s.label}
                    className="udb-barchart__bar"
                    style={{
                      height: `${(v / max) * 100}%`,
                      background: accentOf(s, si, i),
                      opacity: hover === null || hover === i ? 1 : 0.4,
                      ...(v === 0 ? { minHeight: 0 } : {}),
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="udb-barchart__bars">
              {series.map((s, si) => (
                <div
                  key={s.key ?? s.label}
                  className="udb-barchart__bar"
                  style={{
                    height: `${Math.max(2, ((vals(s)[i] ?? 0) / max) * 100)}%`,
                    background: accentOf(s, si, i),
                    opacity: hover === null || hover === i ? 1 : 0.4,
                  }}
                />
              ))}
            </div>
          )}
          {hover === i && (
            <div className="udb-barchart__tip">
              <div className="udb-barchart__tiptitle">{formatLabel(label)}</div>
              {series.map((s, si) => (
                <div key={s.key ?? s.label} className="udb-barchart__tiprow">
                  <span className="udb-barchart__tiplabel">
                    <span className="udb-chartlegend__dot" style={{ background: accentOf(s, si, i) }} />
                    {s.label}
                  </span>
                  <b>{formatValue(vals(s)[i] ?? 0)}</b>
                </div>
              ))}
              {stacking === 'stacked' && (
                <div className="udb-barchart__tiprow udb-barchart__tiprow--total">
                  <span className="udb-barchart__tiplabel">
                    <b>{totalLabel}</b>
                  </span>
                  <b>{formatValue(columnTotals[i] ?? 0)}</b>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
