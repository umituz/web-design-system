import type { ReactNode } from 'react';

export interface HBarRow {
  label: ReactNode;
  sub?: ReactNode;
  value: number;
  tone?: string;
}

export function HBars({ rows, formatValue = (n: number) => String(n) }: { rows: HBarRow[]; formatValue?: (n: number) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="udb-hbars">
      {rows.map((r, i) => (
        <div key={i} className="udb-hbars__row">
          <div className="udb-hbars__label">
            <div className="udb-hbars__name">{r.label}</div>
            {r.sub && <div className="udb-hbars__sub">{r.sub}</div>}
          </div>
          <div className="udb-hbars__track">
            <div
              className="udb-hbars__fill"
              style={{ width: `${(r.value / max) * 100}%`, ...(r.tone ? { background: r.tone } : {}) }}
            />
          </div>
          <span className="udb-hbars__value">{formatValue(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

export interface HorizontalBarsDatum {
  label: string;
  value: number;
  tone?: string;
}

export interface HorizontalBarsProps {
  data: HorizontalBarsDatum[];
  format?: (n: number) => string;
  className?: string;
}

export function HorizontalBars({ data, format = (n: number) => String(n), className }: HorizontalBarsProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className={`udb-hbars hbars${className ? ` ${className}` : ''}`}>
      {data.map((d, i) => (
        <div key={i} className="udb-hbars__row hbars__row">
          <div className="udb-hbars__label hbars__label">
            <span className="udb-hbars__name text-sm truncate">{d.label}</span>
          </div>
          <div className="udb-hbars__track hbars__track">
            <div
              className="udb-hbars__fill hbars__fill"
              style={{
                width: `${(d.value / max) * 100}%`,
                animationDelay: `${i * 40}ms`,
                ...(d.tone ? { background: d.tone } : {}),
              }}
            />
          </div>
          <span className="udb-hbars__value hbars__value mono text-sm">{format(d.value)}</span>
        </div>
      ))}
    </div>
  );
}
