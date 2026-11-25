import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { BarSeriesChart } from '../../presentation/organisms/charts/BarSeriesChart';

describe('BarSeriesChart', () => {
  it('renders columns, bars, and labels', () => {
    const data = [
      { label: 'Q1', primary: 100, secondary: 50 },
      { label: 'Q2', primary: 200, secondary: 120 },
      { label: 'Q3', primary: 150 },
    ];
    const { container } = render(<BarSeriesChart data={data} />);
    const cols = container.querySelectorAll('.bar-chart__col');
    expect(cols).toHaveLength(3);

    const firstColBars = cols[0]!.querySelectorAll('.bar-chart__bar');
    expect(firstColBars).toHaveLength(2);

    const thirdColBars = cols[2]!.querySelectorAll('.bar-chart__bar');
    expect(thirdColBars).toHaveLength(1);

    expect(container.textContent).toContain('Q1');
    expect(container.textContent).toContain('Q2');
    expect(container.textContent).toContain('Q3');
  });

  it('formats ticks using custom formatter', () => {
    const data = [{ label: 'Jan', primary: 1000 }];
    const { container } = render(<BarSeriesChart data={data} format={(n) => `$${n}`} />);
    expect(container.textContent).toContain('$1000');
    expect(container.textContent).toContain('$500');
  });

  it('handles empty data gracefully', () => {
    const { container } = render(<BarSeriesChart data={[]} />);
    expect(container.querySelector('.bar-chart')).not.toBeNull();
  });
});
