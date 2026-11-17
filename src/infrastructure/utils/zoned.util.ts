const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const zonedFormatter = (timeZone: string, withWeekday: boolean): Intl.DateTimeFormat =>
  new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    ...(withWeekday ? { weekday: 'short' as const } : {}),
  });

export const tzOffsetMs = (atUtc: Date, timeZone: string): number => {
  const parts = Object.fromEntries(
    zonedFormatter(timeZone, false).formatToParts(atUtc).map((part) => [part.type, part.value]),
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return asUtc - atUtc.getTime();
};

export interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
  dateIso: string;
}

export const zonedParts = (iso: string, timeZone: string): ZonedParts => {
  const date = new Date(Date.parse(iso));
  const parts = Object.fromEntries(
    zonedFormatter(timeZone, true).formatToParts(date).map((part) => [part.type, part.value]),
  );
  const month = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    weekday: WEEKDAY_INDEX[String(parts.weekday)] ?? 0,
    dateIso: `${parts.year}-${month}-${day}`,
  };
};

export const zonedDayStartUtc = (dateIso: string, timeZone: string): string => {
  const [year = 0, month = 1, day = 1] = dateIso.split('-').map(Number);
  const guess = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  return new Date(guess.getTime() - tzOffsetMs(guess, timeZone)).toISOString();
};

export const todayInTz = (timeZone: string): string => zonedParts(new Date().toISOString(), timeZone).dateIso;
