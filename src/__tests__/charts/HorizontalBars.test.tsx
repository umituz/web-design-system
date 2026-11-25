import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { HorizontalBars } from '../../presentation/organisms/charts/HBars';
import { DonutChart } from '../../presentation/organisms/charts/Donut';

describe('HorizontalBars and DonutChart', () => {
  it('renders HorizontalBars with formatted values and widths', () => {
    const data = [
      { label: 'Alpha', value: 100 },
      { label: 'Beta', value: 50 },
    ];
    const { container } = render(<HorizontalBars data={data} format={(n) => `${n} pts`} />);
    const rows = container.querySelectorAll('.hbars__row');
    expect(rows).toHaveLength(2);
    expect(container.textContent).toContain('Alpha');
    expect(container.textContent).toContain('100 pts');
    expect(container.textContent).toContain('50 pts');

    const fills = container.querySelectorAll('.hbars__fill') as NodeListOf<HTMLElement>;
    expect(fills[0]!.style.width).toBe('100%');
    expect(fills[1]!.style.width).toBe('50%');
  });

  it('renders DonutChart with custom center element', () => {
    const segments = [
      { label: 'Available', value: 10, color: '#3b82f6' },
      { label: 'Sold', value: 5, color: '#ef4444' },
    ];
    const { getByTestId } = render(
      <DonutChart
        segments={segments}
        center={<span data-testid="custom-center">Total: 15</span>}
      />
    );
    expect(getByTestId('custom-center').textContent).toBe('Total: 15');
  });
});
