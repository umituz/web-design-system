/**
 * Calendar Board Component (Organism)
 * @description Month/week/day event board with tone-vocabulary chips; the
 * app owns the event data and the tone mapping, the board owns the grid.
 */

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';
import type { BaseProps } from '../../domain/types';

export type CalendarView = 'month' | 'week' | 'day';
export type CalendarEventTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent';

export interface CalendarEvent {
  id: string;
  /** Day the event lands on, `YYYY-MM-DD`. */
  date: string;
  /** Start time `HH:MM`; sorts events within a day and drives the day-view hour rows. */
  time?: string;
  title: ReactNode;
  tone?: CalendarEventTone;
  icon?: ReactNode;
  meta?: ReactNode;
  onClick?: () => void;
}

export interface CalendarLegendItem {
  tone: CalendarEventTone;
  label: string;
}

export interface CalendarBoardProps extends BaseProps {
  events: readonly CalendarEvent[];
  /** Initial view; the board owns its view state afterwards. */
  view?: CalendarView;
  /** Cursor start day, `YYYY-MM-DD`; defaults to today. */
  initialDate?: string;
  onViewEvent?: (event: CalendarEvent) => void;
  /** Fires when a month cell or a week-day header is picked. */
  onSelectDate?: (date: string) => void;
  legend?: readonly CalendarLegendItem[];
  /** 0 = Sunday, 1 = Monday (default). */
  weekStartsOn?: 0 | 1;
  /** Inclusive hour range for the day view, default `[6, 21]`. */
  dayHours?: readonly [number, number];
  /** Event chips shown per month cell before the `+N` overflow, default 3. */
  maxPerDay?: number;
  /** Locale for weekday/month labels, default `en-US`. */
  locale?: string;
}

const chipTones: Record<CalendarEventTone, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info',
  neutral: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent text-accent-foreground',
};

function toYmd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseYmd(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}

function shift(cursor: Date, view: CalendarView, dir: number): Date {
  const d = new Date(cursor);
  if (view === 'month') d.setMonth(d.getMonth() + dir);
  else if (view === 'week') d.setDate(d.getDate() + dir * 7);
  else d.setDate(d.getDate() + dir);
  return d;
}

export function CalendarBoard({
  events,
  view: initialView = 'month',
  initialDate,
  onViewEvent,
  onSelectDate,
  legend,
  weekStartsOn = 1,
  dayHours = [6, 21],
  maxPerDay = 3,
  locale = 'en-US',
  className,
}: CalendarBoardProps) {
  const [view, setView] = useState<CalendarView>(initialView);
  const [cursor, setCursor] = useState(() => (initialDate ? parseYmd(initialDate) : new Date()));
  const today = toYmd(new Date());

  const byDate = useMemo(() => {
    const m = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const bucket = m.get(e.date);
      if (bucket) bucket.push(e);
      else m.set(e.date, [e]);
    }
    for (const list of m.values()) list.sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));
    return m;
  }, [events]);

  const weekdays = useMemo(() => {
    const base = new Date(2024, 0, 7 + weekStartsOn); // a Sunday + offset
    return Array.from({ length: 7 }, (_, i) =>
      new Date(base.getFullYear(), base.getMonth(), base.getDate() + i).toLocaleDateString(locale, { weekday: 'short' }),
    );
  }, [locale, weekStartsOn]);

  const monthCells = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const startOffset = (new Date(y, m, 1).getDay() + 7 - weekStartsOn) % 7;
    const start = new Date(y, m, 1 - startOffset);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      return { date: toYmd(d), inMonth: d.getMonth() === m };
    });
  }, [cursor, weekStartsOn]);

  const weekDates = useMemo(() => {
    const base = new Date(cursor);
    base.setDate(base.getDate() - ((base.getDay() + 7 - weekStartsOn) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      return toYmd(d);
    });
  }, [cursor, weekStartsOn]);

  const title = useMemo(() => {
    if (view === 'day') return cursor.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    if (view === 'week') {
      const first = parseYmd(weekDates[0]!);
      const last = parseYmd(weekDates[6]!);
      const sameMonth = first.getMonth() === last.getMonth();
      const left = sameMonth
        ? first.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
        : first.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
      const right = last.toLocaleDateString(locale, sameMonth ? { day: 'numeric', year: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' });
      return `${left} – ${right}`;
    }
    return cursor.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  }, [cursor, locale, view, weekDates]);

  const hours = useMemo(() => {
    const [from, to] = dayHours;
    return Array.from({ length: to - from + 1 }, (_, i) => from! + i);
  }, [dayHours]);

  const fire = (e: CalendarEvent) => (onViewEvent ? onViewEvent(e) : e.onClick?.());

  const chip = (e: CalendarEvent) => (
    <button
      key={e.id}
      type="button"
      onClick={(ev) => { ev.stopPropagation(); fire(e); }}
      className={cn(
        'flex w-full cursor-pointer items-center gap-1.5 truncate rounded-md px-1.5 py-1 text-left text-xs font-medium transition-colors hover:brightness-95',
        chipTones[e.tone ?? 'primary'],
      )}
    >
      {e.icon}
      {e.time && <span className="font-mono text-[9.5px] opacity-80">{e.time}</span>}
      <span className="truncate">{e.title}</span>
      {e.meta}
    </button>
  );

  return (
    <div className={cn('overflow-hidden rounded-xl border bg-card text-card-foreground', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <IconButton icon={<ChevronLeft />} label="Previous" variant="outline" onClick={() => setCursor((c) => shift(c, view, -1))} />
          <IconButton icon={<ChevronRight />} label="Next" variant="outline" onClick={() => setCursor((c) => shift(c, view, 1))} />
          <h3 className="ml-1.5 min-w-40 text-sm font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={() => setCursor(new Date())}>Today</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {legend && legend.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              {legend.map((l) => (
                <span key={l.tone + l.label} className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <span className={cn('size-2 rounded-sm', l.tone === 'primary' ? 'bg-primary' : l.tone === 'success' ? 'bg-success' : l.tone === 'warning' ? 'bg-warning' : l.tone === 'danger' ? 'bg-destructive' : l.tone === 'info' ? 'bg-info' : l.tone === 'accent' ? 'bg-accent' : 'bg-secondary-foreground/40')} />
                  {l.label}
                </span>
              ))}
            </div>
          )}
          <ToggleGroup type="single" size="sm" value={view} onValueChange={(v) => v && setView(v as CalendarView)}>
            {(['month', 'week', 'day'] as const).map((v) => (
              <ToggleGroupItem key={v} value={v} className="capitalize">{v}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      {view === 'month' && (
        <>
          <div className="grid grid-cols-7 border-b bg-muted/50">
            {weekdays.map((d) => (
              <div key={d} className="py-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthCells.map((cell) => {
              const dayEvents = byDate.get(cell.date) ?? [];
              return (
                <div
                  key={cell.date}
                  onClick={() => onSelectDate?.(cell.date)}
                  className={cn(
                    'min-h-26 border-b border-r p-1.5 last:border-r-0',
                    !cell.inMonth && 'bg-muted/40 text-muted-foreground/50',
                    cell.date === today && 'bg-primary/5',
                    onSelectDate && 'cursor-pointer',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      'inline-grid size-5 place-items-center rounded-full text-[11px] font-medium',
                      cell.date === today && 'bg-primary text-primary-foreground',
                    )}>
                      {Number(cell.date.slice(8))}
                    </span>
                    {dayEvents.length > maxPerDay && <span className="font-mono text-[9.5px] text-muted-foreground">+{dayEvents.length - maxPerDay}</span>}
                  </div>
                  <div className="mt-1 flex flex-col gap-1">
                    {dayEvents.slice(0, maxPerDay).map((e) => chip(e))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {view === 'week' && (
        <div className="grid grid-cols-7">
          {weekDates.map((date) => {
            const dayEvents = byDate.get(date) ?? [];
            const isToday = date === today;
            return (
              <div key={date} className="min-h-95 border-r last:border-r-0">
                <div className="border-b px-2 py-1.5 text-center">
                  <div className="text-[9px] font-semibold uppercase text-muted-foreground">
                    {parseYmd(date).toLocaleDateString(locale, { weekday: 'short' })}
                  </div>
                  <span className={cn('mt-0.5 inline-grid size-5 place-items-center rounded-full text-[11px] font-medium', isToday && 'bg-primary text-primary-foreground')}>
                    {Number(date.slice(8))}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-1.5" onClick={() => onSelectDate?.(date)}>
                  {dayEvents.map((e) => chip(e))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'day' && (() => {
        const date = toYmd(cursor);
        const dayEvents = byDate.get(date) ?? [];
        return (
          <div className="p-4">
            {dayEvents.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">Nothing scheduled.</p>
            )}
            {hours.map((h) => {
              const hourEvents = dayEvents.filter((e) => e.time && Math.floor(Number(e.time.split(':')[0])) === h);
              return (
                <div key={h} className="grid grid-cols-[56px_1fr] border-t">
                  <div className="border-r py-1.5 pr-2.5 text-right font-mono text-[10.5px] text-muted-foreground">
                    {String(h).padStart(2, '0')}:00
                  </div>
                  <div className="min-h-8 p-1">
                    {hourEvents.map((e) => (
                      <div key={e.id} className="mb-1 last:mb-0">{chip(e)}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
}
