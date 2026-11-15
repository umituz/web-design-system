import { useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  DEFAULT_CALENDAR_LABELS,
  type CalendarItem,
  type CalendarLabels,
} from './calendar.types';
import {
  addDaysKey,
  formatDayTitle,
  groupByDayKey,
  minutesToLabel,
  todayKey,
} from './layout';

export interface CalendarAgendaProps {
  items: readonly CalendarItem[];
  anchorKey: string;
  agendaDays?: number;
  locale?: string;
  labels?: Partial<CalendarLabels>;
  emptyState?: ReactNode;
  onSelectItem?: (item: CalendarItem) => void;
}

export const CalendarAgenda = ({
  items,
  anchorKey,
  agendaDays = 30,
  locale = 'en-US',
  labels,
  emptyState,
  onSelectItem,
}: CalendarAgendaProps) => {
  const text = { ...DEFAULT_CALENDAR_LABELS, ...labels };
  const today = todayKey();
  const windowDays = Math.max(agendaDays, 1);

  const groups = useMemo(() => {
    const byDay = groupByDayKey(items);
    const window: { dayKey: string; dayItems: CalendarItem[] }[] = [];
    for (let offset = 0; offset < windowDays; offset += 1) {
      const dayKey = addDaysKey(anchorKey, offset);
      const dayItems = byDay.get(dayKey);
      if (dayItems && dayItems.length > 0) window.push({ dayKey, dayItems });
    }
    return window;
  }, [items, anchorKey, windowDays]);

  if (groups.length === 0) {
    return (
      <div className="ds-cal-agenda-empty">
        {emptyState ?? <p className="ds-cal-agenda-empty-text">{text.emptyDay}</p>}
      </div>
    );
  }

  return (
    <div className="ds-cal-agenda">
      {groups.map(({ dayKey, dayItems }) => (
        <section
          className={
            dayKey === today ? 'ds-cal-agenda-group is-today' : 'ds-cal-agenda-group'
          }
          key={dayKey}
        >
          <header className="ds-cal-agenda-head">
            <span className="ds-cal-agenda-date">{formatDayTitle(dayKey, locale)}</span>
            {dayKey === today && <span className="ds-cal-agenda-today">{text.today}</span>}
            <span className="ds-cal-agenda-count">{dayItems.length}</span>
          </header>
          <div className="ds-cal-agenda-rows">
            {dayItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className={
                  item.muted
                    ? `ds-cal-agenda-item ds-cal-agenda-item--${item.tone ?? 'primary'} is-muted`
                    : `ds-cal-agenda-item ds-cal-agenda-item--${item.tone ?? 'primary'}`
                }
                onClick={() => onSelectItem?.(item)}
              >
                <span className="ds-cal-agenda-time">
                  {item.startMin !== undefined && minutesToLabel(item.startMin)}
                  {item.endMin !== undefined && (
                    <span className="ds-cal-agenda-time-end">– {minutesToLabel(item.endMin)}</span>
                  )}
                </span>
                <span className={`ds-cal-dot ds-cal-dot--${item.tone ?? 'primary'}`} />
                <span className="ds-cal-agenda-body">
                  <span className="ds-cal-agenda-title">
                    {item.icon}
                    {item.title}
                  </span>
                  {item.meta && <span className="ds-cal-agenda-meta">{item.meta}</span>}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
