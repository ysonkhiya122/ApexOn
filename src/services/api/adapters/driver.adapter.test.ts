import { describe, expect, it } from 'vitest';
import type { JolpicaDriver, JolpicaStanding } from '../types/base.types';
import { transformDriver, transformDrivers, transformDriverStanding } from './driver.adapter';

const rawDriver: JolpicaDriver = {
  driverId: 'hamilton',
  permanentNumber: '44',
  code: 'HAM',
  url: 'https://en.wikipedia.org/wiki/Lewis_Hamilton',
  givenName: 'Lewis',
  familyName: 'Hamilton',
  dateOfBirth: '1985-01-07',
  nationality: 'British',
};

describe('transformDriver', () => {
  it('maps the raw payload onto the normalized model', () => {
    expect(transformDriver(rawDriver)).toEqual({
      id: 'hamilton',
      fullName: 'Lewis Hamilton',
      firstName: 'Lewis',
      lastName: 'Hamilton',
      code: 'HAM',
      number: 44,
      nationality: 'British',
      dateOfBirth: '1985-01-07',
      team: undefined,
    });
  });

  it('coerces permanentNumber to a number', () => {
    expect(transformDriver(rawDriver).number).toBe(44);
    expect(typeof transformDriver(rawDriver).number).toBe('number');
  });

  it('falls back to 0 when a driver has no permanent number', () => {
    const { permanentNumber: _permanentNumber, ...withoutNumber } = rawDriver;
    expect(transformDriver(withoutNumber).number).toBe(0);
  });

  it('falls back to an empty code rather than undefined', () => {
    const { code: _code, ...withoutCode } = rawDriver;
    expect(transformDriver(withoutCode).code).toBe('');
  });

  it('composes fullName from given and family names', () => {
    const driver = transformDriver({
      ...rawDriver,
      givenName: 'Andrea Kimi',
      familyName: 'Antonelli',
    });
    expect(driver.fullName).toBe('Andrea Kimi Antonelli');
  });
});

describe('transformDrivers', () => {
  it('maps every entry', () => {
    expect(transformDrivers([rawDriver, { ...rawDriver, driverId: 'norris' }])).toHaveLength(2);
  });

  it('returns an empty array for an empty list', () => {
    expect(transformDrivers([])).toEqual([]);
  });
});

describe('transformDriverStanding', () => {
  const base: JolpicaStanding = {
    position: '1',
    positionText: '1',
    points: '219',
    wins: '4',
    Driver: rawDriver,
  };

  it('parses numeric fields out of the API strings', () => {
    const standing = transformDriverStanding(base);
    expect(standing.position).toBe(1);
    expect(standing.points).toBe(219);
    expect(standing.wins).toBe(4);
  });

  it('reads the team name from the plural Constructors array', () => {
    const standing = transformDriverStanding({
      ...base,
      Constructors: [{ name: 'Mercedes' }],
    } as JolpicaStanding);
    expect(standing.team).toBe('Mercedes');
  });

  it('still supports the legacy singular Constructor shape', () => {
    const standing = transformDriverStanding({
      ...base,
      Constructor: {
        constructorId: 'ferrari',
        url: '',
        name: 'Ferrari',
        nationality: 'Italian',
      },
    } as JolpicaStanding);
    expect(standing.team).toBe('Ferrari');
  });

  it('degrades to an empty team name instead of throwing', () => {
    expect(transformDriverStanding(base).team).toBe('');
  });

  it('handles fractional points (sprint-era half points)', () => {
    expect(transformDriverStanding({ ...base, points: '19.5' }).points).toBe(19.5);
  });
});
