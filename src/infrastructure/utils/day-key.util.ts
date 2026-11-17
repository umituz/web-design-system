export const toDayKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseDayKey = (day: string): Date => {
  const parts = day.split('-').map(Number);
  return new Date(parts[0] ?? 1970, (parts[1] ?? 1) - 1, parts[2] ?? 1);
};

export const todayKey = (): string => toDayKey(new Date());

export const dayKeyDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toDayKey(date);
};

export const dayKeyFromIso = (iso: string): string => toDayKey(new Date(iso));

export const addDaysKey = (day: string, days: number): string => {
  const date = parseDayKey(day);
  date.setDate(date.getDate() + days);
  return toDayKey(date);
};

export const addMonthsKey = (day: string, months: number): string => {
  const date = parseDayKey(day);
  const dayOfMonth = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(dayOfMonth, lastDay));
  return toDayKey(date);
};

export const daysUntilDayKey = (day: string): number => {
  const target = parseDayKey(day).getTime();
  const today = parseDayKey(todayKey()).getTime();
  return Math.round((target - today) / 86400000);
};

export const daysBetweenKeys = (firstDay: string, secondDay: string): number =>
  Math.round((parseDayKey(secondDay).getTime() - parseDayKey(firstDay).getTime()) / 86400000);

export const weekStartKey = (day: string): string => {
  const [year = 0, month = 1, date = 1] = day.split('-').map(Number);
  const utc = new Date(Date.UTC(year, month - 1, date));
  const dow = utc.getUTCDay();
  const back = dow === 0 ? 6 : dow - 1;
  return new Date(Date.UTC(year, month - 1, date - back)).toISOString().slice(0, 10);
};

export const isoDaysAgo = (days: number, hour: number, minute: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const nowIso = (): string => new Date().toISOString();
