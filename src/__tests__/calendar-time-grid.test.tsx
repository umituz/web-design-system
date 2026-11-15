import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CalendarTimeGrid } from '../presentation/organisms/Calendar/CalendarTimeGrid';
import { CalendarResourceTimeline } from '../presentation/organisms/Calendar/CalendarResourceTimeline';
import type { CalendarItem } from '../presentation/organisms/Calendar/calendar.types';

const timedItem = (
  id: string,
  dayKey: string,
  startMin: number,
  endMin: number,
): CalendarItem => ({ id, dayKey, startMin, endMin, title: id });

const mountGrid = (props: Partial<Parameters<typeof CalendarTimeGrid>[0]> = {}) =>
  render(<CalendarTimeGrid items={[]} days={['2026-03-15']} {...props} />);

const rectMock = (overrides: Partial<DOMRect> = {}) =>
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 0,
    height: 400,
    bottom: 400,
    left: 0,
    right: 100,
    width: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...overrides,
  } as DOMRect);

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CalendarTimeGrid', () => {
  it('positions timed events inside their day lane', () => {
    mountGrid({ items: [timedItem('Consult', '2026-03-15', 600, 660)] });
    const block = screen.getByText('Consult').closest('button') as HTMLElement;
    expect(block.className).toContain('ds-cal-event');
    expect(parseFloat(block.style.top)).toBeCloseTo(21.4286, 3);
    expect(parseFloat(block.style.height)).toBeCloseTo(7.1429, 3);
  });

  it('splits overlapping events into columns', () => {
    mountGrid({
      items: [timedItem('first', '2026-03-15', 600, 660), timedItem('second', '2026-03-15', 630, 690)],
    });
    const first = screen.getByText('first').closest('button') as HTMLElement;
    const second = screen.getByText('second').closest('button') as HTMLElement;
    expect(first.style.width).toBe('calc(50% - 4px)');
    expect(second.style.width).toBe('calc(50% - 4px)');
  });

  it('reports empty single days', () => {
    mountGrid();
    expect(screen.getByText('Nothing scheduled')).toBeTruthy();
  });

  it('quantizes empty-lane clicks to slot boundaries', () => {
    const onSlotClick = vi.fn();
    const { container } = mountGrid({ onSlotClick });
    rectMock();
    const lane = container.querySelector('.ds-cal-lane') as HTMLElement;
    fireEvent.click(lane, { clientY: 100 });
    expect(onSlotClick).toHaveBeenCalledWith('2026-03-15', 630);
  });

  it('reports item selection from an event block', () => {
    const onSelectItem = vi.fn();
    mountGrid({ items: [timedItem('Consult', '2026-03-15', 600, 660)], onSelectItem });
    fireEvent.click(screen.getByText('Consult'));
    expect(onSelectItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'Consult' }),
    );
  });

  it('keeps untimed items in the all-day strip instead of dropping them', () => {
    const { container } = mountGrid({
      days: ['2026-03-15', '2026-03-16'],
      items: [
        timedItem('Consult', '2026-03-15', 600, 660),
        { id: 'Permit expiry', dayKey: '2026-03-16', title: 'Permit expiry', tone: 'danger' },
      ],
    });
    const strip = container.querySelector('.ds-cal-allday');
    expect(strip).toBeTruthy();
    expect(screen.getByText('All day')).toBeTruthy();
    expect(strip?.textContent).toContain('Permit expiry');
    expect(strip?.textContent).not.toContain('Consult');
    expect(container.querySelectorAll('.ds-cal-event')).toHaveLength(1);
  });

  it('does not flag a single day as empty when it only holds all-day items', () => {
    mountGrid({ items: [{ id: 'Expiry', dayKey: '2026-03-15', title: 'Expiry' }] });
    expect(screen.queryByText('Nothing scheduled')).toBeNull();
    expect(screen.getByText('All day')).toBeTruthy();
  });

  it('omits the all-day strip when every item is timed', () => {
    const { container } = mountGrid({ items: [timedItem('Consult', '2026-03-15', 600, 660)] });
    expect(container.querySelector('.ds-cal-allday')).toBeNull();
  });
});

const resourceItem = (
  id: string,
  resourceId: string,
  startMin: number,
  endMin: number,
): CalendarItem => ({ id, dayKey: '2026-03-15', resourceId, startMin, endMin, title: id });

const resources = [
  { id: 'room-1', label: 'Salle Lumière' },
  { id: 'room-2', label: 'Salle Méliès' },
];

const mountTimeline = (props: Partial<Parameters<typeof CalendarResourceTimeline>[0]> = {}) =>
  render(<CalendarResourceTimeline resources={resources} items={[]} {...props} />);

const numberIn = (value: string): number => parseFloat(value.replace(/^calc\(/, ''));

describe('CalendarResourceTimeline', () => {
  it('renders one row per resource and drops items without a matching resource', () => {
    const { container } = mountTimeline({
      items: [resourceItem('Screening', 'room-1', 600, 660), resourceItem('Orphan', 'room-9', 660, 720)],
    });
    const rows = container.querySelectorAll('.ds-cal-res-row');
    expect(rows).toHaveLength(2);
    expect(screen.getByText('Salle Lumière')).toBeTruthy();
    expect(screen.queryByText('Orphan')).toBeNull();
  });

  it('positions blocks along the horizontal minute axis', () => {
    mountTimeline({ items: [resourceItem('Screening', 'room-1', 600, 660)] });
    const block = screen.getByText('Screening').closest('button') as HTMLElement;
    expect(numberIn(block.style.left)).toBeCloseTo(21.4286, 3);
    expect(numberIn(block.style.width)).toBeCloseTo(7.1429, 3);
  });

  it('splits overlapping blocks on the same resource into columns', () => {
    mountTimeline({
      items: [resourceItem('first', 'room-1', 600, 660), resourceItem('second', 'room-1', 630, 690)],
    });
    const first = screen.getByText('first').closest('button') as HTMLElement;
    const second = screen.getByText('second').closest('button') as HTMLElement;
    expect(numberIn(first.style.width)).toBeCloseTo(3.5714, 3);
    expect(numberIn(second.style.width)).toBeCloseTo(3.5714, 3);
  });

  it('quantizes lane clicks to slot boundaries', () => {
    const onSlotClick = vi.fn();
    const { container } = mountTimeline({
      items: [resourceItem('Screening', 'room-1', 600, 660)],
      onSlotClick,
    });
    rectMock({ height: 56, bottom: 56, right: 400, width: 400 });
    const lane = container.querySelector('.ds-cal-res-lane') as HTMLElement;
    fireEvent.click(lane, { clientX: 100 });
    expect(onSlotClick).toHaveBeenCalledWith('room-1', 630);
  });

  it('reports item selection with the payload round-trip', () => {
    const onSelectItem = vi.fn();
    mountTimeline({
      items: [{ ...resourceItem('Screening', 'room-1', 600, 660), payload: { screeningId: 42 } }],
      onSelectItem,
    });
    fireEvent.click(screen.getByText('Screening'));
    expect(onSelectItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'Screening', payload: { screeningId: 42 } }),
    );
  });

  it('falls back to the default empty label when nothing is scheduled', () => {
    mountTimeline();
    expect(screen.getByText('Nothing scheduled')).toBeTruthy();
  });
});
