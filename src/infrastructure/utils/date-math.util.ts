export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const clone = (date: Date): Date => new Date(date.getTime());

export const isValidDate = (input: Date | string | null | undefined): boolean => {
  if (input === null || input === undefined) return false;
  const date = input instanceof Date ? input : new Date(input);
  return !Number.isNaN(date.getTime());
};

export const startOfDay = (date: Date): Date => {
  const next = clone(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

export const endOfDay = (date: Date): Date => {
  const next = clone(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

export const startOfWeek = (date: Date, weekStartsOn: WeekStartsOn = 0): Date => {
  const next = startOfDay(date);
  const diff = (next.getDay() < weekStartsOn ? 7 : 0) + next.getDay() - weekStartsOn;
  next.setDate(next.getDate() - diff);
  return next;
};

export const endOfWeek = (date: Date, weekStartsOn: WeekStartsOn = 0): Date => {
  const next = startOfWeek(date, weekStartsOn);
  next.setDate(next.getDate() + 6);
  return endOfDay(next);
};

export const startOfMonth = (date: Date): Date => {
  const next = startOfDay(date);
  next.setDate(1);
  return next;
};

export const endOfMonth = (date: Date): Date => {
  const next = startOfMonth(date);
  next.setMonth(next.getMonth() + 1);
  next.setDate(0);
  return endOfDay(next);
};

export const addDays = (date: Date, amount: number): Date => {
  const next = clone(date);
  next.setDate(next.getDate() + amount);
  return next;
};

export const subDays = (date: Date, amount: number): Date => addDays(date, -amount);

export const addMinutes = (date: Date, amount: number): Date => {
  const next = clone(date);
  next.setMinutes(next.getMinutes() + amount);
  return next;
};

export const subMonths = (date: Date, amount: number): Date => {
  const next = clone(date);
  const dayOfMonth = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() - amount);
  const lastDay = endOfMonth(next).getDate();
  next.setDate(Math.min(dayOfMonth, lastDay));
  return next;
};

export const setHours = (date: Date, hours: number): Date => {
  const next = clone(date);
  next.setHours(hours);
  return next;
};

export const setMinutes = (date: Date, minutes: number): Date => {
  const next = clone(date);
  next.setMinutes(minutes);
  return next;
};

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const isToday = (date: Date): boolean => isSameDay(date, new Date());

export const isTomorrow = (date: Date): boolean => isSameDay(date, addDays(new Date(), 1));

export const isYesterday = (date: Date): boolean => isSameDay(date, subDays(new Date(), 1));

export const differenceInMinutes = (a: Date, b: Date): number =>
  Math.floor((a.getTime() - b.getTime()) / 60000);

export interface DateInterval {
  start: Date;
  end: Date;
}

export const eachDayOfInterval = (interval: DateInterval): Date[] => {
  const days: Date[] = [];
  const cursor = startOfDay(interval.start);
  const last = startOfDay(interval.end);
  if (cursor > last) return days;
  for (let day = cursor; day <= last; day = addDays(day, 1)) {
    days.push(clone(day));
  }
  return days;
};

export interface Timestamped {
  createdAt: string;
}

export const byOldest = <T extends Timestamped>(a: T, b: T): number =>
  +new Date(a.createdAt) - +new Date(b.createdAt);

export const byNewest = <T extends Timestamped>(a: T, b: T): number =>
  +new Date(b.createdAt) - +new Date(a.createdAt);
