export interface TimeRangeFormatOptions {
  locale?: string;
  timeZone?: string;
}

const dayKeyInZone = (value: string | Date, timeZone?: string): string => {
  const date = value instanceof Date ? value : new Date(value);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  const month = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');
  return `${parts.year}-${month}-${day}`;
};

const timeOf = (value: string | Date, options: TimeRangeFormatOptions): string =>
  new Intl.DateTimeFormat(options.locale ?? 'en', {
    timeZone: options.timeZone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(value instanceof Date ? value : new Date(value));

const dayTimeOf = (value: string | Date, options: TimeRangeFormatOptions): string =>
  new Intl.DateTimeFormat(options.locale ?? 'en', {
    timeZone: options.timeZone,
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(value instanceof Date ? value : new Date(value));

export const formatTimeRange = (
  start: string | Date,
  end: string | Date,
  options: TimeRangeFormatOptions = {},
): string => {
  if (dayKeyInZone(start, options.timeZone) === dayKeyInZone(end, options.timeZone)) {
    return `${timeOf(start, options)} – ${timeOf(end, options)}`;
  }
  return `${dayTimeOf(start, options)} – ${dayTimeOf(end, options)}`;
};

export const overlaps = (
  aStart: string | Date,
  aEnd: string | Date,
  bStart: string | Date,
  bEnd: string | Date,
): boolean => {
  const instant = (value: string | Date): number =>
    value instanceof Date ? value.getTime() : Date.parse(value);
  return instant(aStart) < instant(bEnd) && instant(bStart) < instant(aEnd);
};
