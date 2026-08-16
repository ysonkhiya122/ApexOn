import { describe, expect, it } from 'vitest';
import type { JolpicaRace } from '../types/base.types';
import { transformRace, transformRaces } from './race.adapter';

const rawRace: JolpicaRace = {
  season: '2026',
  round: '15',
  url: 'https://en.wikipedia.org/wiki/2026_Dutch_Grand_Prix',
  raceName: 'Dutch Grand Prix',
  Circuit: {
    circuitId: 'zandvoort',
    url: 'https://en.wikipedia.org/wiki/Circuit_Zandvoort',
    circuitName: 'Circuit Park Zandvoort',
    Location: {
      lat: '52.3888',
      long: '4.54092',
      locality: 'Zandvoort',
      country: 'Netherlands',
    },
  },
  date: '2026-08-23',
  time: '13:00:00Z',
};

describe('transformRace', () => {
  const race = transformRace(rawRace);

  /**
   * Regression guard: the home page hero read `nextRace.raceName` and
   * `nextRace.Circuit.circuitName` on this normalized object, so the headline
   * rendered blank in production. The adapter's contract is `name` / `circuit`.
   */
  it('exposes the race title as `name`, not `raceName`', () => {
    expect(race.name).toBe('Dutch Grand Prix');
    expect(race).not.toHaveProperty('raceName');
  });

  it('exposes the circuit as `circuit`, not `Circuit`', () => {
    expect(race.circuit.name).toBe('Circuit Park Zandvoort');
    expect(race).not.toHaveProperty('Circuit');
  });

  it('normalizes the circuit location', () => {
    expect(race.circuit).toMatchObject({
      id: 'zandvoort',
      locality: 'Zandvoort',
      country: 'Netherlands',
    });
  });

  it('parses coordinates into numbers', () => {
    expect(race.circuit.latitude).toBeCloseTo(52.3888);
    expect(race.circuit.longitude).toBeCloseTo(4.54092);
  });

  it('parses season and round as numbers', () => {
    expect(race.season).toBe(2026);
    expect(race.round).toBe(15);
  });

  it('builds a stable season-round id', () => {
    expect(race.id).toBe('2026-15');
  });

  it('preserves date and time verbatim for countdown maths', () => {
    expect(race.date).toBe('2026-08-23');
    expect(race.time).toBe('13:00:00Z');
  });

  it('leaves time undefined when the API omits it', () => {
    const { time: _time, ...withoutTime } = rawRace;
    expect(transformRace(withoutTime).time).toBeUndefined();
  });

  it('marks a future race as scheduled', () => {
    const future = new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10);
    expect(transformRace({ ...rawRace, date: future }).status).toBe('scheduled');
  });

  it('marks a past race with results as completed', () => {
    const past = transformRace({
      ...rawRace,
      date: '2020-08-23',
      Results: [{ position: '1' }] as JolpicaRace['Results'],
    });
    expect(past.status).toBe('completed');
  });
});

describe('transformRaces', () => {
  it('maps a full calendar', () => {
    const races = transformRaces([rawRace, { ...rawRace, round: '16' }]);
    expect(races.map((r) => r.round)).toEqual([15, 16]);
  });

  it('returns an empty array for an empty calendar', () => {
    expect(transformRaces([])).toEqual([]);
  });
});
