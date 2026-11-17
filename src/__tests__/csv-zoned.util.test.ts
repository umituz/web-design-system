import { describe, expect, it } from 'vitest';
import { downloadCsv, toCsv } from '../infrastructure/utils/csv.util';
import { todayInTz, tzOffsetMs, zonedDayStartUtc, zonedParts } from '../infrastructure/utils/zoned.util';

interface Row {
  name: string;
  qty: number;
}

const COLUMNS = [
  { header: 'Name', value: (row: Row) => row.name },
  { header: 'Qty', value: (row: Row) => row.qty },
];

describe('toCsv', () => {
  it('renders header and rows', () => {
    expect(toCsv([{ name: 'Tea', qty: 2 }], COLUMNS)).toBe('Name,Qty\nTea,2');
  });

  it('escapes quotes, commas and newlines', () => {
    expect(toCsv([{ name: 'a"b', qty: 1 }], COLUMNS)).toBe('Name,Qty\n"a""b",1');
    expect(toCsv([{ name: 'a,b', qty: 1 }], COLUMNS)).toBe('Name,Qty\n"a,b",1');
    expect(toCsv([{ name: 'a\nb', qty: 1 }], COLUMNS)).toBe('Name,Qty\n"a\nb",1');
  });

  it('renders empty cells for null and undefined', () => {
    const columns = [
      { header: 'A', value: (row: Row) => (row.qty > 0 ? row.name : null) },
      { header: 'B', value: () => undefined },
    ];
    expect(toCsv([{ name: 'x', qty: 0 }], columns)).toBe('A,B\n,');
  });
});

describe('downloadCsv', () => {
  it('appends the csv extension when missing and keeps it when present', () => {
    const created: Blob[] = [];
    const originalCreate = URL.createObjectURL;
    const originalRevoke = URL.revokeObjectURL;
    URL.createObjectURL = (blob: Blob) => {
      created.push(blob);
      return 'blob:mock';
    };
    URL.revokeObjectURL = () => {};
    const downloads: string[] = [];
    const clicks: number[] = [];
    const originalCreateElement = document.createElement;
    document.createElement = ((tag: string) => {
      const element = originalCreateElement.call(document, tag);
      if (tag === 'a') {
        Object.defineProperty(element, 'download', {
          get: () => '',
          set: (value: string) => downloads.push(value),
          configurable: true,
        });
        element.click = () => clicks.push(1);
      }
      return element;
    }) as typeof document.createElement;
    try {
      downloadCsv('report', 'A,B\n1,2');
      downloadCsv('report.csv', 'A,B\n1,2');
    } finally {
      document.createElement = originalCreateElement;
      URL.createObjectURL = originalCreate;
      URL.revokeObjectURL = originalRevoke;
    }
    expect(downloads).toEqual(['report.csv', 'report.csv']);
    expect(clicks.length).toBe(2);
    expect(created.length).toBe(2);
  });
});

describe('zoned helpers', () => {
  it('splits an instant into calendar parts for the zone', () => {
    const parts = zonedParts('2026-03-10T23:30:00Z', 'Europe/Istanbul');
    expect(parts).toEqual({
      year: 2026,
      month: 3,
      day: 11,
      hour: 2,
      minute: 30,
      weekday: 3,
      dateIso: '2026-03-11',
    });
  });

  it('computes the utc instant of local midnight', () => {
    expect(zonedDayStartUtc('2026-03-11', 'Europe/Istanbul')).toBe('2026-03-10T21:00:00.000Z');
    expect(zonedDayStartUtc('2026-03-11', 'UTC')).toBe('2026-03-11T00:00:00.000Z');
  });

  it('reports zone offsets in ms east of utc', () => {
    expect(tzOffsetMs(new Date('2026-03-11T12:00:00Z'), 'UTC')).toBe(0);
    expect(tzOffsetMs(new Date('2026-03-11T12:00:00Z'), 'Europe/Istanbul')).toBe(3 * 3600_000);
  });

  it('returns the current calendar date in the zone', () => {
    const utc = todayInTz('UTC');
    expect(utc).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
