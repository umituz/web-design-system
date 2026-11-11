import { useCallback, useRef, type ReactNode } from 'react';
import { useElementWidth } from '../../hooks/useElementWidth';
import { ChartCard } from './ChartCard';
import { Legend } from './Legend';
import { gridTicks, niceMax, seriesColor, shortLabel, useTip, type TipRow } from './utils';

export interface BarsSeries {
  name: string;
  color?: string;
}

export interface BarsCardDatum {
  label: string;
  values: readonly number[];
}

export interface BarsCardProps {
  title: string;
  subtitle?: string;
  data: readonly BarsCardDatum[];
  series?: readonly BarsSeries[];
  formatValue: (v: number) => string;
  height?: number;
  legendMax?: number;
  actions?: ReactNode;
}

export function BarsCard({
  title,
  subtitle,
  data,
  series,
  formatValue,
  height = 200,
  legendMax = 6,
  actions,
}: BarsCardProps) {
  const plotRef = useRef<HTMLDivElement | null>(null);
  const { tip, hostRef, show, hide } = useTip(plotRef);
  const { ref: widthRef, width } = useElementWidth();
  const setPlot = useCallback(
    (node: HTMLDivElement | null) => {
      plotRef.current = node;
      hostRef.current = node;
      widthRef(node);
    },
    [plotRef, hostRef, widthRef],
  );

  const grouped = (series?.length ?? 0) > 0;
  const n = data.length;
  if (n === 0) return null;

  const padLeft = 48;
  const padRight = 8;
  const padTop = 12;
  const padBottom = 26;
  const innerW = Math.max(10, width - padLeft - padRight);
  const innerH = Math.max(10, height - padTop - padBottom);

  const seriesCount = grouped ? series!.length : 1;
  const max = niceMax(Math.max(1, ...data.flatMap((d) => d.values.slice(0, seriesCount))));
  const ticks = gridTicks(max);
  const bandW = innerW / n;
  const barW = grouped
    ? Math.min(20, (bandW / seriesCount) * 0.68)
    : Math.min(46, bandW * 0.56);
  const yAt = (v: number) => padTop + innerH - (v / max) * innerH;
  const labelEvery = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(innerW / 56))));

  const colorOf = (si: number) => (grouped ? series![si]!.color ?? seriesColor(si) : seriesColor(si));

  const total = data.reduce((sum, d) => sum + (d.values[0] ?? 0), 0);
  const legendNode = grouped ? (
    <Legend items={series!.map((s, si) => ({ label: s.name, color: colorOf(si) }))} />
  ) : n <= legendMax ? (
    <Legend
      items={data.map((d, i) => ({
        label: d.label,
        color: seriesColor(i),
        value: formatValue(d.values[0] ?? 0),
      }))}
    />
  ) : undefined;

  const rowsFor = (d: BarsCardDatum): TipRow[] => {
    if (!grouped) {
      const v = d.values[0] ?? 0;
      return [
        { label: d.label, value: formatValue(v), color: seriesColor(0) },
        { label: 'Σ', value: `${Math.round((v / (total || 1)) * 100)}%` },
      ];
    }
    const rows: TipRow[] = series!.map((s, si) => ({
      label: s.name,
      value: formatValue(d.values[si] ?? 0),
      color: colorOf(si),
    }));
    if (series!.length === 2) {
      rows.push({ label: 'Δ', value: formatValue((d.values[0] ?? 0) - (d.values[1] ?? 0)) });
    }
    return rows;
  };

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      legend={legendNode}
      actions={actions}
      hostRef={setPlot}
      tip={tip}
      onMouseLeave={hide}
    >
      <svg viewBox={`0 0 ${width} ${height}`} style={{ height }} role="img" aria-label={title}>
        {ticks.map((tv) => (
          <g key={tv}>
            <line
              x1={padLeft}
              x2={width - padRight}
              y1={yAt(tv)}
              y2={yAt(tv)}
              className="udb-linechart__grid"
            />
            <text x={padLeft - 6} y={yAt(tv) + 3} textAnchor="end" className="udb-linechart__axis">
              {formatValue(tv)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const bandX = padLeft + bandW * i;
          return (
            <g key={`${d.label}-${i}`}>
              {grouped
                ? series!.map((s, si) => {
                    const v = d.values[si] ?? 0;
                    const barH = Math.max(1.5, (v / max) * innerH);
                    const slotW = bandW / seriesCount;
                    const x = bandX + slotW * si + (slotW - barW) / 2;
                    return (
                      <rect
                        key={s.name}
                        x={x}
                        y={padTop + innerH - barH}
                        width={barW}
                        height={barH}
                        rx={2}
                        fill={colorOf(si)}
                        opacity={0.92}
                      />
                    );
                  })
                : (() => {
                    const v = d.values[0] ?? 0;
                    const barH = Math.max(1.5, (v / max) * innerH);
                    const x = bandX + (bandW - barW) / 2;
                    return (
                      <rect
                        x={x}
                        y={padTop + innerH - barH}
                        width={barW}
                        height={barH}
                        rx={2.5}
                        fill={seriesColor(i)}
                        opacity={0.92}
                      />
                    );
                  })()}
              <rect
                x={bandX}
                y={padTop}
                width={bandW}
                height={innerH}
                fill="transparent"
                onMouseMove={(e) => show(e, d.label, rowsFor(d))}
              />
            </g>
          );
        })}
        <line
          x1={padLeft}
          x2={width - padRight}
          y1={padTop + innerH}
          y2={padTop + innerH}
          stroke="var(--color-border)"
          strokeWidth={1}
        />
        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <text
              key={`xl-${d.label}-${i}`}
              x={padLeft + bandW * i + bandW / 2}
              y={height - 8}
              textAnchor="middle"
              className="udb-linechart__axis"
            >
              {shortLabel(d.label, 10)}
            </text>
          ) : null,
        )}
      </svg>
    </ChartCard>
  );
}
