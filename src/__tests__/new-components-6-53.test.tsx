import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  PipelineStrip,
  PipelineStep,
  ServiceCard,
  HeatStrip,
  ProgressionTimeline,
  ReceiptView,
} from '../presentation/organisms';

afterEach(cleanup);

describe('PipelineStrip & PipelineStep', () => {
  it('renders pipeline steps with label and count', () => {
    const handleSelect = vi.fn();
    const steps = [
      { id: 'all', label: 'All Tickets', count: 42, active: true, onClick: handleSelect },
      { id: 'open', label: 'Open', count: 12, onClick: handleSelect },
      { id: 'closed', label: 'Closed', count: 30 },
    ];

    render(<PipelineStrip steps={steps} ariaLabel="Ticket pipeline" />);
    const strip = screen.getByRole('tablist', { name: 'Ticket pipeline' });
    expect(strip).not.toBeNull();

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
    expect(tabs[0]?.textContent).toContain('42');
    expect(tabs[0]?.textContent).toContain('All Tickets');

    fireEvent.click(tabs[1]!);
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('renders individual PipelineStep in mini variant', () => {
    render(<PipelineStep label="Queue" count={8} variant="mini" active tone="warning" />);
    const step = screen.getByRole('tab');
    expect(step.getAttribute('aria-selected')).toBe('true');
    expect(step.textContent).toContain('8');
    expect(step.textContent).toContain('Queue');
  });
});

describe('ServiceCard', () => {
  it('renders service details, facts, badge, and notes', () => {
    const facts = [
      { label: 'Duration', value: '60 min' },
      { label: 'Price', value: '$120' },
    ];

    render(
      <ServiceCard
        title="Deep Tissue Massage"
        subtitle="Therapeutic"
        badge={<span>Popular</span>}
        description="Focused pressure to release chronic tension."
        facts={facts}
        note="Arrive 10 min early."
        warningNote="Not suitable during acute flare-ups."
      />,
    );

    expect(screen.getByText('Deep Tissue Massage')).not.toBeNull();
    expect(screen.getByText('Therapeutic')).not.toBeNull();
    expect(screen.getByText('Popular')).not.toBeNull();
    expect(screen.getByText('Focused pressure to release chronic tension.')).not.toBeNull();
    expect(screen.getByText('Duration')).not.toBeNull();
    expect(screen.getByText('60 min')).not.toBeNull();
    expect(screen.getByText('Arrive 10 min early.')).not.toBeNull();
    expect(screen.getByText('Not suitable during acute flare-ups.')).not.toBeNull();
  });

  it('handles click events when clickable', () => {
    const handleClick = vi.fn();
    render(<ServiceCard title="Express Facial" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Express Facial'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('HeatStrip', () => {
  it('renders intensity cells and aria-label', () => {
    render(<HeatStrip values={[0, 1, 3, 5]} max={5} ariaLabel="Activity map" />);
    const strip = screen.getByRole('img', { name: 'Activity map' });
    expect(strip).not.toBeNull();
    expect(strip.children).toHaveLength(4);
  });
});

describe('ProgressionTimeline', () => {
  it('renders progression steps with status and dates', () => {
    const steps = [
      { id: '1', name: 'White', status: 'done' as const, date: '2024-01-01', color: '#ffffff' },
      { id: '2', name: 'Blue', status: 'current' as const, date: '2025-06-01', color: '#0066cc' },
      { id: '3', name: 'Purple', status: 'pending' as const, color: '#8800cc' },
    ];

    render(<ProgressionTimeline steps={steps} ariaLabel="Belt progression" />);
    const container = screen.getByRole('img', { name: 'Belt progression' });
    expect(container).not.toBeNull();
    expect(screen.getByText('White')).not.toBeNull();
    expect(screen.getByText('Blue')).not.toBeNull();
    expect(screen.getByText('Purple')).not.toBeNull();
    expect(screen.getByText('2024-01-01')).not.toBeNull();
  });

  it('hides dates in compact mode', () => {
    const steps = [
      { id: '1', name: 'Stage 1', status: 'done' as const, date: '2024-01-01' },
      { id: '2', name: 'Stage 2', status: 'current' as const, date: '2024-02-01' },
    ];

    render(<ProgressionTimeline steps={steps} compact />);
    expect(screen.queryByText('2024-01-01')).toBeNull();
  });
});

describe('ReceiptView', () => {
  it('renders sales receipt items, totals, and barcodes', () => {
    const lines = [
      { id: 'l1', name: 'Espresso Beans', quantity: 2, unitPrice: '$15.00', total: '$30.00', sku: 'ESP-1' },
      { id: 'l2', name: 'Paper Cups', quantity: 1, unitPrice: '$5.00', total: '$5.00' },
    ];
    const meta = [
      { label: 'Receipt #', value: 'REC-1001' },
      { label: 'Date', value: '2026-11-27' },
    ];

    render(
      <ReceiptView
        title="Acme Store"
        subtitle="Main Branch"
        meta={meta}
        lines={lines}
        subtotal="$35.00"
        discount="$5.00"
        tax="$2.40"
        total="$32.40"
        code="*REC1001*"
        footer="Thank you for shopping with us!"
      />,
    );

    expect(screen.getByText('Acme Store')).not.toBeNull();
    expect(screen.getByText('Main Branch')).not.toBeNull();
    expect(screen.getByText('REC-1001')).not.toBeNull();
    expect(screen.getByText('Espresso Beans')).not.toBeNull();
    expect(screen.getByText('$30.00')).not.toBeNull();
    expect(screen.getByText('$32.40')).not.toBeNull();
    expect(screen.getByText('*REC1001*')).not.toBeNull();
    expect(screen.getByText('Thank you for shopping with us!')).not.toBeNull();
  });
});
