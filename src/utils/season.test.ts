import { describe, expect, it } from 'vitest';
import {
  CURRENT_SEASON,
  CURRENT_SEASON_TOKEN,
  FIRST_SEASON,
  isCurrentSeason,
  seasonOptions,
} from './season';

describe('season', () => {
  it('exposes the Jolpica "current" token so the app never goes stale', () => {
    expect(CURRENT_SEASON_TOKEN).toBe('current');
  });

  it('derives the current season from the clock', () => {
    expect(CURRENT_SEASON).toBe(String(new Date().getFullYear()));
  });

  describe('seasonOptions', () => {
    const options = seasonOptions();

    it('starts at the current season and ends at 1950', () => {
      expect(options[0].value).toBe(CURRENT_SEASON);
      expect(options.at(-1)?.value).toBe(String(FIRST_SEASON));
    });

    it('is contiguous and strictly descending', () => {
      const years = options.map((option) => Number(option.value));
      years.forEach((year, index) => {
        if (index === 0) return;
        expect(years[index - 1] - year).toBe(1);
      });
    });

    it('covers every season exactly once', () => {
      expect(new Set(options.map((o) => o.value)).size).toBe(options.length);
      expect(options).toHaveLength(Number(CURRENT_SEASON) - FIRST_SEASON + 1);
    });

    it('uses the year as both label and value', () => {
      options.slice(0, 5).forEach((option) => {
        expect(option.label).toBe(option.value);
      });
    });
  });

  describe('isCurrentSeason', () => {
    it('accepts both the literal year and the API token', () => {
      expect(isCurrentSeason(CURRENT_SEASON)).toBe(true);
      expect(isCurrentSeason('current')).toBe(true);
    });

    it('rejects other seasons', () => {
      expect(isCurrentSeason('1997')).toBe(false);
      expect(isCurrentSeason('')).toBe(false);
    });
  });
});
