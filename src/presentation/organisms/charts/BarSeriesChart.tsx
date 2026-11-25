import { useMemo } from 'react';

export interface BarSeriesDatum {
  label: string;
  primary: number;
  secondary?: number;
}

export interface BarSeriesChartProps {
  data: BarSeriesDatum[];
  height?: number;
  format?: (n: number) => string;
  className?: string;
}

export function BarSeriesChart({
  data,
  height = 180,
  format,
  className,
}: BarSeriesChartProps) {
  const max = useMemo(
    () => Math.max(...data.flatMap((d) => [d.primary, d.secondary ?? 0]), 1),
    [data]
  );
  const n = data.length || 1;
  const bw = 100 / n;
  const gridTicks = [0.25, 0.5, 0.75, 1];

  return (
    <div className={`udb-bar-series bar-chart${className ? ` ${className}` : ''}`} style={{ '--h': `${height}px` } as React.CSSProperties}>
      <div className="udb-bar-series__plot bar-chart__plot">
        {gridTicks.map((t) => (
          <div key={t} className="udb-bar-series__gridline bar-chart__gridline" style={{ bottom: `${t * 100}%` }}>
            <span className="udb-bar-series__tick bar-chart__tick mono">{format ? format(max * t) : Math.round(max * t)}</span>
          </div>
        ))}
        <div className="udb-bar-series__cols bar-chart__cols">
          {data.map((d, i) => (
            <div key={i} className="udb-bar-series__col bar-chart__col" style={{ width: `${bw}%` }}>
              <div
                className="udb-bar-series__bar bar-chart__bar"
                style={{ height: `${(d.primary / max) * 100}%`, animationDelay: `${i * 30}ms` }}
                title={`${d.label}: ${format ? format(d.primary) : d.primary}`}
              />
              {d.secondary != null && (
                <div
                  className="udb-bar-series__bar udb-bar-series__bar--ghost bar-chart__bar bar-chart__bar--ghost"
                  style={{ height: `${(d.secondary / max) * 100}%`, animationDelay: `${i * 30 + 60}ms` }}
                  title={`${d.label}: ${format ? format(d.secondary) : d.secondary}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="udb-bar-series__labels bar-chart__labels mono">
        {data.map((d, i) => (
          <span key={i} style={{ width: `${bw}%` }}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
