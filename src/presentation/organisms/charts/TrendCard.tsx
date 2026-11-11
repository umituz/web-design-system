import { useCallback, useRef, type ReactNode } from 'react';
import { useElementWidth } from '../../hooks/useElementWidth';
import { ChartCard } from './ChartCard';
import { gridTicks, niceMax, seriesColor, shortLabel, useTip } from './utils';

export interface TrendCardProps {
  title: string;
  subtitle?: string;
  data: readonly { label: string; value: number }[];
  formatValue: (v: number) => string;
  height?: number;
  color?: string;
  legend?: ReactNode;
  actions?: ReactNode;
}

export function TrendCard({
  title,
  subtitle,
  data,
  formatValue,
  height = 180,
  color,
  legend,
  actions,
}: TrendCardProps) {
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

  const tone = color ?? seriesColor(0);
  const padLeft = 48;
  const padRight = 8;
  const padTop = 12;
  const padBottom = 24;
  const innerW = Math.max(10, width - padLeft - padRight);
  const innerH = Math.max(10, height - padTop - padBottom);
  const n = data.length;
  if (n === 0) return null;

  const max = niceMax(Math.max(1, ...data.map((d) => d.value)));
  const ticks = gridTicks(max);
  const xAt = (i: number) => padLeft + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (v: number) => padTop + innerH - (v / max) * innerH;
  const labelEvery = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(innerW / 58))));

  const line = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(d.value).toFixed(1)}`)
    .join(' ');
  const area = `${line} L${xAt(n - 1).toFixed(1)},${padTop + innerH} L${padLeft},${padTop + innerH} Z`;

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      legend={legend}
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
        <path d={area} fill={tone} opacity={0.08} />
        <path
          d={line}
          fill="none"
          stroke={tone}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {data.map((d, i) => (
          <g key={`${d.label}-${i}`}>
            <circle
              cx={xAt(i)}
              cy={yAt(d.value)}
              r={9}
              fill="transparent"
              onMouseMove={(e) =>
                show(e, d.label, [{ label: d.label, value: formatValue(d.value), color: tone }])
              }
            />
            <circle cx={xAt(i)} cy={yAt(d.value)} r={2.6} fill="var(--color-card)" stroke={tone} strokeWidth={1.8} pointerEvents="none" />
          </g>
        ))}
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
            <text key={`xl-${d.label}-${i}`} x={xAt(i)} y={height - 7} textAnchor="middle" className="udb-linechart__axis">
              {shortLabel(d.label, 12)}
            </text>
          ) : null,
        )}
      </svg>
    </ChartCard>
  );
}
