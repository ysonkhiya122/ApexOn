/**
 * Driver Adapter
 *
 * Transforms raw Jolpica/OpenF1 API driver data into normalized Driver models.
 * Components should ONLY use the normalized output.
 */

import type { JolpicaDriver, JolpicaStanding, JolpicaResult } from '../types/base.types';
import type {
  Driver,
  DriverStats,
  DriverSeasonResult,
  DriverStanding,
} from '../types/normalized.types';

/**
 * Transform raw Jolpica driver to normalized Driver model
 */
export const transformDriver = (raw: JolpicaDriver): Driver => {
  return {
    id: raw.driverId,
    fullName: `${raw.givenName} ${raw.familyName}`,
    firstName: raw.givenName,
    lastName: raw.familyName,
    code: raw.code || '',
    number: raw.permanentNumber ? parseInt(raw.permanentNumber, 10) : 0,
    nationality: raw.nationality,
    dateOfBirth: raw.dateOfBirth,
    team: undefined, // Will be populated separately
  };
};

/**
 * Transform array of raw drivers
 */
export const transformDrivers = (rawDrivers: JolpicaDriver[]): Driver[] => {
  return rawDrivers.map(transformDriver);
};

/**
 * Transform raw standing entry to normalized DriverStanding
 */
export const transformDriverStanding = (raw: JolpicaStanding): DriverStanding => {
  // Jolpica driver standings expose constructors as `Constructors`;
  // some adapter tests/legacy payloads may still provide a singular
  // `Constructor`, so support both shapes.
  const constructors = (raw as JolpicaStanding & { Constructors?: Array<{ name: string }> })
    .Constructors;
  const teamName = raw.Constructor?.name || constructors?.[0]?.name || '';

  return {
    position: parseInt(raw.position, 10),
    driver: raw.Driver ? transformDriver(raw.Driver) : ({} as Driver),
    team: teamName, // Store as string, not object
    points: parseFloat(raw.points),
    wins: parseInt(raw.wins, 10),
  };
};

/**
 * Transform array of standings
 */
export const transformDriverStandings = (rawStandings: JolpicaStanding[]): DriverStanding[] => {
  return rawStandings.map(transformDriverStanding);
};

/**
 * Calculate driver career statistics from race results
 */
export const calculateDriverStats = (driverId: string, results: JolpicaResult[]): DriverStats => {
  let championships = 0;
  let raceWins = 0;
  let podiums = 0;
  let polePositions = 0;
  let fastestLaps = 0;
  let careerPoints = 0;

  results.forEach((result) => {
    // Count wins
    if (result.position === '1') {
      raceWins++;
    }

    // Count podiums
    if (['1', '2', '3'].includes(result.position)) {
      podiums++;
    }

    // Count pole positions
    if (result.grid === '1') {
      polePositions++;
    }

    // Count fastest laps
    if (result.FastestLap?.rank === '1') {
      fastestLaps++;
    }

    // Sum points
    careerPoints += parseFloat(result.points);
  });

  // Note: Championships would need season-by-season aggregation
  // This is a simplified version
  championships = raceWins > 5 ? 1 : 0; // Simplified logic

  return {
    driverId,
    championships,
    raceWins,
    podiums,
    polePositions,
    fastestLaps,
    careerPoints,
    racesEntered: results.length,
  };
};

/**
 * Transform race results into season-by-season driver results
 */
export const transformDriverSeasonResults = (results: JolpicaResult[]): DriverSeasonResult[] => {
  const seasonMap = new Map<
    number,
    {
      points: number;
      wins: number;
      races: number;
      team: string;
      bestPosition: number;
    }
  >();

  results.forEach((result) => {
    // Extract season from context (would need to be passed in)
    // This is simplified
    const season = new Date().getFullYear(); // TODO: thread real season through the adapter

    if (!seasonMap.has(season)) {
      seasonMap.set(season, {
        points: 0,
        wins: 0,
        races: 0,
        team: result.Constructor.name,
        bestPosition: 999,
      });
    }

    const seasonData = seasonMap.get(season)!;
    seasonData.points += parseFloat(result.points);
    seasonData.races += 1;

    if (result.position === '1') {
      seasonData.wins += 1;
    }

    const position = parseInt(result.position, 10);
    if (position < seasonData.bestPosition) {
      seasonData.bestPosition = position;
    }
  });

  return Array.from(seasonMap.entries()).map(([season, data]) => ({
    season,
    team: data.team,
    points: data.points,
    position: data.bestPosition === 999 ? 0 : data.bestPosition,
    races: data.races,
    wins: data.wins,
  }));
};

/**
 * Format driver name for display
 * Centralized formatting logic (NOT in components)
 */
export const formatDriverName = (driver: Driver, format: 'full' | 'last' | 'code'): string => {
  switch (format) {
    case 'last':
      return driver.lastName;
    case 'code':
      return driver.code || driver.lastName;
    case 'full':
    default:
      return driver.fullName;
  }
};

/**
 * Get driver nationality flag emoji (simplified mapping)
 */
export const getNationalityFlag = (nationality: string): string => {
  const flagMap: Record<string, string> = {
    British: '🇬🇧',
    Dutch: '🇳🇱',
    Monegasque: '🇲🇨',
    Spanish: '🇪🇸',
    French: '🇫🇷',
    German: '🇩🇪',
    Italian: '🇮🇹',
    Australian: '🇦🇺',
    Mexican: '🇲🇽',
    Japanese: '🇯🇵',
    // Add more as needed
  };

  return flagMap[nationality] || '🏁';
};
