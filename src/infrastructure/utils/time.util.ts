export interface TimeAgoOptions {
  now?: Date;
  locale?: string;
  compact?: boolean;
  invalidDateOutput?: string;
}

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30.44 * DAY;
const YEAR = 365.25 * DAY;

export const timeAgo = (input: Date | string | number, options: TimeAgoOptions = {}): string => {
  const { now = new Date(), locale = 'en', compact = false } = options;
  const date = input instanceof Date ? input : new Date(input);
  const time = date.getTime();
  if (Number.isNaN(time) && options.invalidDateOutput !== undefined) return options.invalidDateOutput;
  const deltaSeconds = Math.round((time - now.getTime()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: compact ? 'narrow' : 'long' });
  const abs = Math.abs(deltaSeconds);
  if (abs < 45) return formatter.format(0, 'second');
  if (abs < HOUR) return formatter.format(Math.round(deltaSeconds / MINUTE), 'minute');
  if (abs < DAY) return formatter.format(Math.round(deltaSeconds / HOUR), 'hour');
  if (abs < WEEK) return formatter.format(Math.round(deltaSeconds / DAY), 'day');
  if (abs < MONTH) return formatter.format(Math.round(deltaSeconds / WEEK), 'week');
  if (abs < YEAR) return formatter.format(Math.round(deltaSeconds / MONTH), 'month');
  return formatter.format(Math.round(deltaSeconds / YEAR), 'year');
};

export const formatCountdown = (ms: number): string => {
  if (ms <= 0) return '0:00';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d >= 1) return `${d}d ${h}h`;
  if (h >= 1) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
};
