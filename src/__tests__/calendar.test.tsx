import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Calendar } from '../presentation/organisms/Calendar/Calendar';
import { CalendarMonth } from '../presentation/organisms/Calendar/CalendarMonth';
import { CalendarAgenda } from '../presentation/organisms/Calendar/CalendarAgenda';
import type { CalendarItem } from '../presentation/organisms/Calendar/calendar.types';
import { todayKey } from '../infrastructure/utils/day-key.util';

const item = (id: string, dayKey: string, startMin?: number, endMin?: number): CalendarItem => ({
  id,
  dayKey,
  startMin,
  endMin,
  title: id,
});

const mountCalendar = (props: Partial<Parameters<typeof Calendar>[0]> = {}) =>
  render(
    <Calendar
      items={[item('Kickoff', '2026-03-15', 600, 660)]}
      cursor="2026-03-10"
      {...props}
    />,
  );

afterEach(cleanup);

describe('Calendar', () => {
  it('renders the month grid with a localized title by default', () => {
    const { container } = mountCalendar();
    expect(screen.getByText('March 2026')).toBeTruthy();
    expect(container.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
  });

  it('switches to a seven-lane week grid and a single day grid', () => {
    mountCalendar();
    fireEvent.click(screen.getByText('Week'));
    expect(screen.getByRole('region', { name: '2026-03-15' })).toBeTruthy();
    fireEvent.click(screen.getByText('Day'));
    expect(screen.getByText('Tuesday, March 10, 2026')).toBeTruthy();
  });

  it('drills from a month cell into the day view', () => {
    const onSelectDay = vi.fn();
    render(
      <Calendar
        items={[item('Kickoff', '2026-03-15', 600, 660)]}
        initialCursor="2026-03-10"
        onSelectDay={onSelectDay}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '2026-03-15' }));
    expect(onSelectDay).toHaveBeenCalledWith('2026-03-15');
    expect(screen.getByText('Sunday, March 15, 2026')).toBeTruthy();
  });

  it('stays in the month view when the day view is not offered', () => {
    render(
      <Calendar
        items={[{ id: 'Expiry', dayKey: '2026-03-15', title: 'Expiry' }]}
        initialCursor="2026-03-10"
        views={['month', 'agenda']}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '2026-03-15' }));
    expect(screen.getByText('March 2026')).toBeTruthy();
  });

  it('respects a controlled view', () => {
    mountCalendar({ view: 'day' });
    expect(screen.getByText('Tuesday, March 10, 2026')).toBeTruthy();
  });

  it('reports view changes', () => {
    const onViewChange = vi.fn();
    mountCalendar({ onViewChange });
    fireEvent.click(screen.getByText('Week'));
    expect(onViewChange).toHaveBeenCalledWith('week');
  });

  it('renders the legend', () => {
    mountCalendar({ legend: [{ tone: 'success', label: 'Confirmed' }] });
    expect(screen.getByText('Confirmed')).toBeTruthy();
  });

  it('renders toolbar extras inside the toolbar', () => {
    mountCalendar({ toolbarExtra: <span className="calendar-count">4 appointments</span> });
    const extra = screen.getByText('4 appointments').closest('.ds-cal-extra');
    expect(extra).toBeTruthy();
  });

  it('switches to the agenda view with a window title', () => {
    mountCalendar({ views: ['month', 'agenda'] });
    fireEvent.click(screen.getByText('Agenda'));
    expect(screen.getByText('Mar 10 – Apr 8, 2026')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Kickoff/ })).toBeTruthy();
  });

  it('shifts the agenda window by agendaDays', () => {
    render(
      <Calendar
        items={[item('Kickoff', '2026-03-15', 600, 660)]}
        initialCursor="2026-03-10"
        views={['agenda']}
        agendaDays={30}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Apr 9 – May 8, 2026')).toBeTruthy();
  });
});

const mountMonth = (props: Partial<Parameters<typeof CalendarMonth>[0]> = {}) =>
  render(<CalendarMonth items={[]} anchorKey="2026-03-10" {...props} />);

describe('CalendarMonth', () => {
  it('renders a six-by-seven matrix', () => {
    const { container } = mountMonth();
    expect(container.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
  });

  it('places items on their day and reports selections', () => {
    const onSelectItem = vi.fn();
    mountMonth({ items: [item('Kickoff', '2026-03-15', 600)], onSelectItem });
    fireEvent.click(screen.getByText('Kickoff'));
    expect(onSelectItem).toHaveBeenCalledTimes(1);
    expect(onSelectItem.mock.calls[0]![0].id).toBe('Kickoff');
  });

  it('caps chips per cell and overflows through the more label', () => {
    const onSelectDay = vi.fn();
    const items = [
      item('one', '2026-03-15', 540),
      item('two', '2026-03-15', 600),
      item('three', '2026-03-15', 660),
      item('four', '2026-03-15', 720),
    ];
    mountMonth({ items, maxPerDay: 2, onSelectDay });
    expect(screen.getByText('one')).toBeTruthy();
    expect(screen.getByText('two')).toBeTruthy();
    expect(screen.queryByText('three')).toBeNull();
    expect(screen.getByText('+2 more')).toBeTruthy();
    fireEvent.click(screen.getByText('+2 more'));
    expect(onSelectDay).toHaveBeenCalledWith('2026-03-15');
  });

  it('supports label overrides for the overflow chip', () => {
    const items = [item('one', '2026-03-15'), item('two', '2026-03-15'), item('three', '2026-03-15')];
    mountMonth({ items, maxPerDay: 1, labels: { more: '+{count} tane' } });
    expect(screen.getByText('+2 tane')).toBeTruthy();
  });

  it('fires day selection from the day number button', () => {
    const onSelectDay = vi.fn();
    mountMonth({ onSelectDay });
    fireEvent.click(screen.getByRole('button', { name: '2026-03-15' }));
    expect(onSelectDay).toHaveBeenCalledWith('2026-03-15');
  });
});

describe('CalendarAgenda', () => {
  it('groups only days with items inside the window', () => {
    render(
      <CalendarAgenda
        items={[
          item('Kickoff', '2026-03-15', 600, 660),
          item('Beyond', '2026-04-20', 900),
        ]}
        anchorKey="2026-03-10"
        agendaDays={30}
      />,
    );
    expect(screen.getByText('Sunday, March 15, 2026')).toBeTruthy();
    expect(screen.queryByText(/April 20/)).toBeNull();
  });

  it('marks the today group and counts its items', () => {
    const today = todayKey();
    render(
      <CalendarAgenda
        items={[item('First', today, 540, 600), item('Second', today, 720)]}
        anchorKey={today}
      />,
    );
    expect(screen.getByText('Today')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('fires onSelectItem with the payload-carrying item', () => {
    const onSelectItem = vi.fn();
    render(
      <CalendarAgenda
        items={[item('Kickoff', '2026-03-15', 600, 660)]}
        anchorKey="2026-03-15"
        onSelectItem={onSelectItem}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Kickoff/ }));
    expect(onSelectItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'Kickoff', dayKey: '2026-03-15' }),
    );
  });

  it('renders a custom empty state when the window has no items', () => {
    render(
      <CalendarAgenda
        items={[]}
        anchorKey="2026-03-10"
        emptyState={<button type="button">Book a shoot day</button>}
      />,
    );
    expect(screen.getByText('Book a shoot day')).toBeTruthy();
  });

  it('falls back to the default empty label', () => {
    render(<CalendarAgenda items={[]} anchorKey="2026-03-10" />);
    expect(screen.getByText('Nothing scheduled')).toBeTruthy();
  });
});
