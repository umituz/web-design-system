import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { PlanPicker } from '../presentation/organisms/PlanPicker';
import type { PlanPickerPlan } from '../presentation/organisms/PlanPicker';

afterEach(cleanup);

const plans: PlanPickerPlan[] = [
  { id: 'starter', name: 'Starter', price: '$0', priceNote: '/ forever', ctaLabel: 'Downgrade' },
  { id: 'pro', name: 'Pro', price: '$29', priceNote: '/ mo', badge: 'Popular', highlight: true, ctaLabel: 'Choose Pro' },
  { id: 'master', name: 'Master', price: '$59', priceNote: '/ mo', current: true, ctaLabel: 'Current tier' },
];

describe('PlanPicker cycle switch', () => {
  it('renders the cycle options and reports changes', () => {
    const onCycleChange = vi.fn();
    render(
      <PlanPicker
        plans={plans}
        cycles={[
          { value: 'monthly' as const, label: 'Monthly' },
          { value: 'yearly' as const, label: 'Yearly', hint: '-17%' },
        ]}
        cycle="monthly"
        onCycleChange={onCycleChange}
      />,
    );
    expect(screen.getByRole('button', { name: /monthly/i }).className).toContain('bg-background');
    expect(screen.getByRole('button', { name: /yearly/i }).className).not.toContain('bg-background');
    fireEvent.click(screen.getByRole('button', { name: /yearly/i }));
    expect(onCycleChange).toHaveBeenCalledWith('yearly');
  });
});

describe('PlanPicker plan cards', () => {
  it('fires the per-plan CTA and marks the selected card', () => {
    const onPlanSelect = vi.fn();
    const proSelect = vi.fn();
    render(
      <PlanPicker
        plans={plans.map((p) => (p.id === 'pro' ? { ...p, onSelect: proSelect } : p))}
        selectedId="pro"
        onPlanSelect={onPlanSelect}
      />,
    );
    const proCard = screen.getByRole('radio', { name: /choose pro/i });
    expect(proCard.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Choose Pro' }));
    expect(proSelect).toHaveBeenCalledTimes(1);
    expect(onPlanSelect).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('radio', { name: /downgrade/i }));
    expect(onPlanSelect).toHaveBeenCalledWith('starter');
  });

  it('renders the current plan as a static marker, not a button', () => {
    render(<PlanPicker plans={plans} onPlanSelect={() => {}} />);
    expect(screen.queryByRole('button', { name: /current tier/i })).toBeNull();
    const marker = screen.getByText('Current tier');
    expect(marker.className).toContain('bg-success/10');
  });

  it('busy locks every CTA', () => {
    render(
      <PlanPicker
        plans={[{ id: 'a', name: 'A', price: '$1', ctaLabel: 'Buy', onSelect: () => {} }]}
        busy
      />,
    );
    const cta = screen.getByRole('button', { name: /buy/i }) as HTMLButtonElement;
    expect(cta.disabled).toBe(true);
  });

  it('maps the columns prop onto the grid', () => {
    const { container, rerender } = render(<PlanPicker plans={plans} columns={2} />);
    const grid = container.querySelector('.grid') as HTMLElement;
    expect(grid.className).toContain('sm:grid-cols-2');
    expect(grid.className).not.toContain('lg:grid-cols-3');
    rerender(<PlanPicker plans={plans} columns={4} />);
    expect(grid.className).toContain('lg:grid-cols-4');
  });
});
