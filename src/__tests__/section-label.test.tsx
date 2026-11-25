import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { SectionLabel } from '../presentation/atoms/SectionLabel';

describe('SectionLabel', () => {
  it('renders number padded to 2 digits', () => {
    const { container } = render(<SectionLabel no={1}>Overview</SectionLabel>);
    const no = container.querySelector('.section-label__no');
    expect(no?.textContent).toBe('01');
    expect(container.textContent).toContain('Overview');
  });

  it('renders without number when no is omitted', () => {
    const { container } = render(<SectionLabel>Details</SectionLabel>);
    expect(container.querySelector('.section-label__no')).toBeNull();
    expect(container.textContent).toContain('Details');
  });

  it('applies custom className', () => {
    const { container } = render(<SectionLabel no={5} className="custom-section">Metrics</SectionLabel>);
    expect(container.firstElementChild?.classList.contains('custom-section')).toBe(true);
    expect(container.querySelector('.section-label__no')?.textContent).toBe('05');
  });
});
