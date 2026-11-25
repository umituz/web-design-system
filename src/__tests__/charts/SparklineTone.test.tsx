import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Sparkline } from '../../presentation/organisms/charts/Sparkline';

describe('Sparkline tone and fill', () => {
  it('renders SVG with gradient fill by default', () => {
    const { container } = render(<Sparkline data={[10, 25, 40, 20]} tone="accent" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    const linearGradient = container.querySelector('linearGradient');
    expect(linearGradient).not.toBeNull();
  });

  it('disables gradient fill when fill=false', () => {
    const { container } = render(<Sparkline data={[10, 25, 40, 20]} fill={false} tone="live" />);
    const linearGradient = container.querySelector('linearGradient');
    expect(linearGradient).toBeNull();
  });

  it('returns null for data with fewer than 2 points', () => {
    const { container } = render(<Sparkline data={[10]} />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('applies custom className and custom color', () => {
    const { container } = render(<Sparkline data={[5, 15, 30]} color="#123456" className="test-sparkline" />);
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('test-sparkline')).toBe(true);
    const circle = container.querySelector('circle');
    expect(circle?.getAttribute('fill')).toBe('#123456');
  });
});
