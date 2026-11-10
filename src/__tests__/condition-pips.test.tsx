import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ConditionPips } from '../presentation/molecules/ConditionPips';

describe('ConditionPips', () => {
  it('renders score pips with default max of 5', () => {
    const { container } = render(<ConditionPips score={3} />);
    const root = container.querySelector('.cond-pips');
    expect(root).toBeDefined();
    expect(root?.getAttribute('aria-label')).toBe('3/5');

    const pips = container.querySelectorAll('.pip');
    expect(pips.length).toBe(5);

    const onPips = container.querySelectorAll('.pip.on');
    expect(onPips.length).toBe(3);
  });

  it('handles custom max and zero or null scores', () => {
    const { container: c1 } = render(<ConditionPips score={null} max={4} />);
    const root1 = c1.querySelector('.cond-pips');
    expect(root1?.getAttribute('aria-label')).toBe('0/4');
    expect(c1.querySelectorAll('.pip').length).toBe(4);
    expect(c1.querySelectorAll('.pip.on').length).toBe(0);

    const { container: c2 } = render(<ConditionPips score={7} max={5} ariaLabel="Excellent (5/5)" />);
    const root2 = c2.querySelector('.cond-pips');
    expect(root2?.getAttribute('aria-label')).toBe('Excellent (5/5)');
    expect(c2.querySelectorAll('.pip.on').length).toBe(5);
  });
});
