/**
 * Team Adapter
 *
 * Transforms raw Jolpica API constructor data into normalized Team models.
 */

import type { JolpicaConstructor, JolpicaStanding } from '../types/base.types';
import type { Team, TeamStats, ConstructorStanding } from '../types/normalized.types';

/**
 * Transform raw constructor to normalized Team model
 */
export const transformTeam = (raw: JolpicaConstructor): Team => {
  return {
    id: raw.constructorId,
    name: raw.name,
    fullName: raw.name,
    nationality: raw.nationality,
  };
};

/**
 * Transform array of raw constructors
 */
export const transformTeams = (rawTeams: JolpicaConstructor[]): Team[] => {
  return rawTeams.map(transformTeam);
};

/**
 * Transform raw constructor standing to normalized ConstructorStanding
 */
export const transformConstructorStanding = (raw: JolpicaStanding): ConstructorStanding => {
  return {
    position: parseInt(raw.position, 10),
    team: raw.Constructor ? transformTeam(raw.Constructor) : ({} as Team),
    points: parseFloat(raw.points),
    wins: parseInt(raw.wins, 10),
  };
};

/**
 * Transform array of constructor standings
 */
export const transformConstructorStandings = (
  rawStandings: JolpicaStanding[]
): ConstructorStanding[] => {
  return rawStandings.map(transformConstructorStanding);
};

/**
 * Calculate team statistics from race results
 */
export const calculateTeamStats = (
  teamId: string,
  results: any[] // Would be properly typed with race results
): TeamStats => {
  const championships = 0;
  let raceWins = 0;
  let podiums = 0;
  const polePositions = 0;
  let totalPoints = 0;

  results.forEach((result) => {
    if (result.position === '1') {
      raceWins++;
    }
    if (['1', '2', '3'].includes(result.position)) {
      podiums++;
    }
    totalPoints += parseFloat(result.points);
  });

  return {
    teamId,
    championships,
    raceWins,
    podiums,
    polePositions,
    totalPoints,
    seasonsCompeted: 1, // Would calculate from unique seasons
  };
};

/**
 * Format team name for display
 */
export const formatTeamName = (team: Team, format: 'full' | 'short'): string => {
  if (format === 'short') {
    // Could implement abbreviation logic here
    return team.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }
  return team.fullName;
};
