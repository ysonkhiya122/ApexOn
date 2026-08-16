import { describe, expect, it } from 'vitest';
import {
  isDataStale,
  validateDriverEntry,
  validateLeaderboardResponse,
  validateSessionData,
} from './validateLiveTiming';

/**
 * This module is the crash barrier between OpenF1's inconsistent public feed
 * and the race-center UI. Every case below is a payload the API has been
 * observed to return, so a regression here means a white screen mid-race.
 */
describe('validateDriverEntry', () => {
  it('accepts a nested driver shape', () => {
    expect(validateDriverEntry({ position: 1, driver: { driver_number: 44 } })).toBe(true);
  });

  it('accepts a flat driver shape', () => {
    expect(validateDriverEntry({ position: 1, driver_number: 44 })).toBe(true);
  });

  it('rejects null and undefined', () => {
    expect(validateDriverEntry(null)).toBe(false);
    expect(validateDriverEntry(undefined)).toBe(false);
  });

  it('rejects an entry with no position', () => {
    expect(validateDriverEntry({ driver_number: 44 })).toBe(false);
  });

  it('rejects an entry with no driver number', () => {
    expect(validateDriverEntry({ position: 1 })).toBe(false);
  });

  it('accepts position 0 rather than treating it as missing', () => {
    expect(validateDriverEntry({ position: 0, driver_number: 44 })).toBe(true);
  });
});

describe('validateLeaderboardResponse', () => {
  it('returns an empty array for null, undefined and non-arrays', () => {
    expect(validateLeaderboardResponse(null)).toEqual([]);
    expect(validateLeaderboardResponse(undefined)).toEqual([]);
    expect(validateLeaderboardResponse({ error: 'rate limited' })).toEqual([]);
    expect(validateLeaderboardResponse('502 Bad Gateway')).toEqual([]);
  });

  it('drops malformed entries but keeps valid ones', () => {
    const result = validateLeaderboardResponse([
      { position: 1, driver_number: 1 },
      null,
      { position: 2 },
      { driver_number: 44 },
      { position: 3, driver_number: 16 },
    ]);
    expect(result).toHaveLength(2);
  });

  it('never throws on a fully garbage payload', () => {
    expect(() => validateLeaderboardResponse([undefined, 0, '', false, []])).not.toThrow();
    expect(validateLeaderboardResponse([undefined, 0, '', false, []])).toEqual([]);
  });
});

describe('validateSessionData', () => {
  it('rejects empty input', () => {
    expect(validateSessionData(null)).toBe(false);
    expect(validateSessionData(undefined)).toBe(false);
  });
});

describe('isDataStale', () => {
  it('treats a fresh timestamp as current', () => {
    expect(isDataStale(Date.now())).toBe(false);
  });

  it('treats an old timestamp as stale', () => {
    expect(isDataStale(Date.now() - 60_000)).toBe(true);
  });

  it('honours a custom threshold', () => {
    const fiveSecondsAgo = Date.now() - 5_000;
    expect(isDataStale(fiveSecondsAgo, 10_000)).toBe(false);
    expect(isDataStale(fiveSecondsAgo, 1_000)).toBe(true);
  });
});
