import { useId } from 'react';

export type SparklineTone = 'accent' | 'ink' | 'live' | 'primary' | 'muted' | 'success' | 'danger';

export interface SparklineProps {
  data: readonly number[];
  height?: number;
  width?: number;
  color?: string;
  tone?: SparklineTone;
  fill?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  height = 34,
  width = 110,
  color,
  tone = 'accent',
  fill = true,
  className,
}: SparklineProps) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9]/g, '');
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const resolvedColor =
    color ??
    (tone === 'accent'
      ? 'var(--accent, currentColor)'
      : tone === 'live'
        ? 'var(--live, #ef4444)'
        : tone === 'ink'
          ? 'var(--ink, currentColor)'
          : tone === 'primary'
            ? 'var(--color-primary, currentColor)'
            : tone === 'success'
              ? 'var(--color-success, #22c55e)'
              : tone === 'danger'
                ? 'var(--color-danger, #ef4444)'
                : 'var(--color-muted, #94a3b8)');

  const pts = data.map((v, i) => [(i / (data.length - 1)) * width, height - 3 - ((v - min) / span) * (height - 8)]);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]!.toFixed(1)},${p[1]!.toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className={className}>
      {fill && (
        <defs>
          <linearGradient id={`sp${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={resolvedColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={resolvedColor} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {fill && <path d={area} fill={`url(#sp${id})`} />}
      <path d={line} fill="none" stroke={resolvedColor} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts.at(-1)![0]} cy={pts.at(-1)![1]} r="2.4" fill={resolvedColor} />
    </svg>
  );
}
