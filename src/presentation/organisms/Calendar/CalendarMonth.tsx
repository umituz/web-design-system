import { useMemo } from 'react';
import {
  DEFAULT_CALENDAR_LABELS,
  type CalendarItem,
  type CalendarLabels,
} from './calendar.types';
import {
  formatDayNumber,
  formatWeekdayShort,
  groupByDayKey,
  minutesToLabel,
  monthMatrix,
  sameMonth,
  todayKey,
  weekDays,
} from './layout';

export interface CalendarMonthProps {
  items: readonly CalendarItem[];
  anchorKey: string;
  weekStartsOn?: 0 | 1;
  locale?: string;
  maxPerDay?: number;
  labels?: Partial<CalendarLabels>;
  onSelectDay?: (dayKey: string) => void;
  onSelectItem?: (item: CalendarItem) => void;
}

export const CalendarMonth = ({
  items,
  anchorKey,
  weekStartsOn = 1,
  locale = 'en-US',
  maxPerDay = 3,
  labels,
  onSelectDay,
  onSelectItem,
}: CalendarMonthProps) => {
  const text = { ...DEFAULT_CALENDAR_LABELS, ...labels };
  const today = todayKey();
  const cells = useMemo(() => monthMatrix(anchorKey, weekStartsOn), [anchorKey, weekStartsOn]);
  const byDay = useMemo(() => groupByDayKey(items), [items]);

  return (
    <div className="ds-cal-month" role="grid">
      <div className="ds-cal-month-head" role="row">
        {weekDays(anchorKey, weekStartsOn).map((dayKey) => (
          <div className="ds-cal-month-weekday" role="columnheader" key={dayKey}>
            {formatWeekdayShort(dayKey, locale)}
          </div>
        ))}
      </div>
      <div className="ds-cal-month-body">
        {cells.map((dayKey) => {
          const dayItems = byDay.get(dayKey) ?? [];
          const visible = dayItems.slice(0, maxPerDay);
          const overflow = dayItems.length - visible.length;
          return (
            <div
              className={
                sameMonth(dayKey, anchorKey) ? 'ds-cal-month-cell' : 'ds-cal-month-cell is-outside'
              }
              role="gridcell"
              key={dayKey}
            >
              <button
                type="button"
                className={dayKey === today ? 'ds-cal-month-daynum is-today' : 'ds-cal-month-daynum'}
                onClick={() => onSelectDay?.(dayKey)}
                aria-label={dayKey}
              >
                {formatDayNumber(dayKey)}
              </button>
              <div className="ds-cal-month-chips">
                {visible.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={
                      item.muted
                        ? `ds-cal-chip ds-cal-chip--${item.tone ?? 'primary'} is-muted`
                        : `ds-cal-chip ds-cal-chip--${item.tone ?? 'primary'}`
                    }
                    onClick={() => onSelectItem?.(item)}
                  >
                    {item.icon}
                    {item.startMin !== undefined && (
                      <span className="ds-cal-chip-time">{minutesToLabel(item.startMin)}</span>
                    )}
                    <span className="ds-cal-chip-title">{item.title}</span>
                  </button>
                ))}
                {overflow > 0 && (
                  <button
                    type="button"
                    className="ds-cal-chip-more"
                    onClick={() => onSelectDay?.(dayKey)}
                  >
                    {text.more.replace('{count}', String(overflow))}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
