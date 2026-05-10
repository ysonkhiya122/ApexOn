/**
 * Race Adapter
 * 
 * Transforms raw Jolpica API race data into normalized Race models.
 */

import type { JolpicaRace, JolpicaCircuit, JolpicaResult } from '../types/base.types';
import type { Race, Circuit, RaceResult, FastestLap } from '../types/normalized.types';
import { transformDriver } from './driver.adapter';
import { transformTeam } from './team.adapter';

/**
 * Transform raw circuit to normalized Circuit model
 */
export const transformCircuit = (raw: JolpicaCircuit): Circuit => {
  return {
    id: raw.circuitId,
    name: raw.circuitName,
    locality: raw.Location.locality,
    country: raw.Location.country,
    latitude: parseFloat(raw.Location.lat),
    longitude: parseFloat(raw.Location.long),
  };
};

/**
 * Transform array of raw circuits
 */
export const transformCircuits = (rawCircuits: JolpicaCircuit[]): Circuit[] => {
  return rawCircuits.map(transformCircuit);
};

/**
 * Transform raw race to normalized Race model
 */
export const transformRace = (raw: JolpicaRace): Race => {
  return {
    id: `${raw.season}-${raw.round}`,
    season: parseInt(raw.season, 10),
    round: parseInt(raw.round, 10),
    name: raw.raceName,
    circuit: transformCircuit(raw.Circuit),
    date: raw.date,
    time: raw.time,
    status: determineRaceStatus(raw.date, raw.Results),
  };
};

/**
 * Determine race status based on date and results
 */
const determineRaceStatus = (
  date: string,
  results?: JolpicaResult[]
): 'scheduled' | 'completed' | 'cancelled' => {
  const raceDate = new Date(date);
  const now = new Date();

  if (raceDate > now) {
    return 'scheduled';
  }
  
  if (results && results.length > 0) {
    return 'completed';
  }
  
  return 'cancelled';
};

/**
 * Transform array of raw races
 */
export const transformRaces = (rawRaces: JolpicaRace[]): Race[] => {
  return rawRaces.map(transformRace);
};

/**
 * Transform raw race result to normalized RaceResult
 */
export const transformRaceResult = (raw: JolpicaResult): RaceResult => {
  return {
    position: parseInt(raw.position, 10),
    driver: transformDriver(raw.Driver),
    team: transformTeam(raw.Constructor),
    points: parseFloat(raw.points),
    grid: parseInt(raw.grid, 10),
    laps: parseInt(raw.laps, 10),
    status: raw.status,
    time: raw.Time?.time,
    fastestLap: raw.FastestLap ? transformFastestLap(raw.FastestLap) : undefined,
  };
};

/**
 * Transform raw fastest lap data
 */
export const transformFastestLap = (raw: any): FastestLap => {
  return {
    rank: parseInt(raw.rank, 10),
    lap: parseInt(raw.lap, 10),
    time: raw.Time.time,
    speed: parseFloat(raw.AverageSpeed?.speed || '0'),
  };
};

/**
 * Transform array of race results
 */
export const transformRaceResults = (rawResults: JolpicaResult[]): RaceResult[] => {
  return rawResults.map(transformRaceResult);
};

/**
 * Format race date for display
 * Centralized formatting logic (NOT in components)
 */
export const formatRaceDate = (date: string, format: 'full' | 'short' | 'relative'): string => {
  const raceDate = new Date(date);
  const now = new Date();
  
  if (format === 'relative') {
    const diffMs = raceDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days ago`;
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `in ${diffDays} days`;
    }
  }
  
  if (format === 'short') {
    return raceDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
  
  return raceDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format lap time for display (e.g., "1:23.456")
 */
export const formatLapTime = (timeMs: number): string => {
  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);
  const milliseconds = Math.floor(timeMs % 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

/**
 * Format race time (e.g., "14:00:00Z" to "2:00 PM")
 */
export const formatRaceTime = (time: string, timezone?: string): string => {
  const date = new Date(time);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  });
};
