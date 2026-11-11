import type { ReactNode } from 'react';
import { ChartCard } from './ChartCard';
import { Donut } from './Donut';

export interface DonutCardProps {
  title: string;
  subtitle?: string;
  data: readonly { label: string; value: number }[];
  formatValue: (v: number) => string;
  centerLabel?: string;
  size?: number;
  thickness?: number;
  segmentMax?: number;
  legend?: ReactNode;
  actions?: ReactNode;
}

export function DonutCard({
  title,
  subtitle,
  data,
  formatValue,
  centerLabel,
  size = 168,
  thickness = 20,
  segmentMax = 7,
  legend,
  actions,
}: DonutCardProps) {
  const positive = data.filter((d) => d.value > 0).slice(0, segmentMax);
  const total = positive.reduce((sum, d) => sum + d.value, 0);

  return (
    <ChartCard title={title} subtitle={subtitle} legend={legend} actions={actions} tip={null}>
      <Donut
        segments={positive.map((d) => ({ label: d.label, value: d.value }))}
        size={size}
        thickness={thickness}
        centerValue={formatValue(total)}
        centerLabel={centerLabel}
        formatValue={formatValue}
      />
    </ChartCard>
  );
}
