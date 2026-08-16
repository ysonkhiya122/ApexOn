import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatLap, formatRaceTime, isToday } from './formatRaceTime';

const NOW = new Date('2026-08-16T12:00:00Z');
const minutesAgo = (n: number) => new Date(NOW.getTime() - n * 60_000).toISOString();
const hoursAgo = (n: number) => new Date(NOW.getTime() - n * 3_600_000).toISOString();

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('formatRaceTime', () => {
  it('prefers race context over wall-clock time when a lap is known', () => {
    expect(formatRaceTime(hoursAgo(3), 42)).toBe('Lap 42');
  });

  it('falls back to relative time when no lap is given', () => {
    expect(formatRaceTime(minutesAgo(0))).toBe('Just now');
    expect(formatRaceTime(minutesAgo(1))).toBe('1 min ago');
    expect(formatRaceTime(minutesAgo(3))).toBe('3 mins ago');
    expect(formatRaceTime(minutesAgo(30))).toBe('30 min ago');
  });

  it('switches to hours past the 60 minute mark', () => {
    expect(formatRaceTime(hoursAgo(1))).toBe('1 hour ago');
    expect(formatRaceTime(hoursAgo(5))).toBe('5 hours ago');
  });

  it('falls back to an absolute clock time for events over a day old', () => {
    const result = formatRaceTime(hoursAgo(30));
    expect(result).toMatch(/\d{2}:\d{2}\s?(AM|PM)/i);
  });

  it('treats lap 0 as unknown and uses relative time', () => {
    expect(formatRaceTime(minutesAgo(2), 0)).toBe('2 mins ago');
  });
});

describe('formatLap', () => {
  it('renders a lap label', () => {
    expect(formatLap(1)).toContain('1');
  });
});

describe('isToday', () => {
  it('is true for a timestamp earlier today', () => {
    expect(isToday(hoursAgo(2))).toBe(true);
  });

  it('is false for yesterday', () => {
    expect(isToday(hoursAgo(30))).toBe(false);
  });
});
