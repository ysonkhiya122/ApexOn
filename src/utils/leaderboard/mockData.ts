/**
 * Leaderboard Mock Data
 * 
 * For testing leaderboard functionality without live API.
 * Simulates Top 10 drivers with various positions, gaps, and tire strategies.
 */

import type { LeaderboardEntry, OpenF1LiveTiming } from '../../types/leaderboard.types';

/**
 * Mock live timing data (Top 10)
 */
export const mockLiveTiming: OpenF1LiveTiming = {
  session_key: 9158,
  timestamp: new Date().toISOString(),
  data: [
    {
      driver_number: 1,
      position: 1,
      gap_to_leader: 0,
      interval: 0,
      last_lap_time: '1:23.456',
      best_lap_time: '1:22.123',
      tire_compound: 'MEDIUM',
      tire_age: 12,
      drs: 0,
    },
    {
      driver_number: 44,
      position: 2,
      gap_to_leader: 12.345,
      interval: 12.345,
      last_lap_time: '1:23.789',
      best_lap_time: '1:22.456',
      tire_compound: 'HARD',
      tire_age: 25,
      drs: 1,
    },
    {
      driver_number: 4,
      position: 3,
      gap_to_leader: 18.234,
      interval: 5.889,
      last_lap_time: '1:24.012',
      best_lap_time: '1:22.789',
      tire_compound: 'SOFT',
      tire_age: 8,
      drs: 1,
    },
    {
      driver_number: 16,
      position: 4,
      gap_to_leader: 24.567,
      interval: 6.333,
      last_lap_time: '1:24.234',
      best_lap_time: '1:23.012',
      tire_compound: 'MEDIUM',
      tire_age: 15,
      drs: 0,
    },
    {
      driver_number: 55,
      position: 5,
      gap_to_leader: 32.891,
      interval: 8.324,
      last_lap_time: '1:24.567',
      best_lap_time: '1:23.234',
      tire_compound: 'HARD',
      tire_age: 28,
      drs: 1,
    },
    {
      driver_number: 63,
      position: 6,
      gap_to_leader: 45.123,
      interval: 12.232,
      last_lap_time: '1:24.891',
      best_lap_time: '1:23.567',
      tire_compound: 'SOFT',
      tire_age: 5,
      drs: 0,
    },
    {
      driver_number: 11,
      position: 7,
      gap_to_leader: 52.456,
      interval: 7.333,
      last_lap_time: '1:25.123',
      best_lap_time: '1:23.891',
      tire_compound: 'MEDIUM',
      tire_age: 18,
      drs: 1,
    },
    {
      driver_number: 14,
      position: 8,
      gap_to_leader: 1.234, // LAP (lapped)
      interval: -1,
      last_lap_time: '1:25.456',
      best_lap_time: '1:24.123',
      tire_compound: 'HARD',
      tire_age: 32,
      drs: 0,
    },
    {
      driver_number: 31,
      position: 9,
      gap_to_leader: 1.567, // LAP (lapped)
      interval: 0.333,
      last_lap_time: '1:25.789',
      best_lap_time: '1:24.456',
      tire_compound: 'SOFT',
      tire_age: 3,
      drs: 1,
    },
    {
      driver_number: 23,
      position: 10,
      gap_to_leader: 1.891, // LAP (lapped)
      interval: 0.324,
      last_lap_time: '1:26.012',
      best_lap_time: '1:24.789',
      tire_compound: 'MEDIUM',
      tire_age: 20,
      drs: 0,
    },
  ],
};

/**
 * Pre-built leaderboard entries for direct testing
 */
export const mockLeaderboardEntries: LeaderboardEntry[] = [
  {
    position: 1,
    previousPosition: 1,
    driver: {
      id: 'verstappen',
      firstName: 'Max',
      lastName: 'Verstappen',
      fullName: 'Max Verstappen',
      number: 1,
      team: 'Red Bull Racing',
    },
    team: 'Red Bull Racing',
    gapToLeader: 'LEADER',
    interval: '---',
    tire: { compound: 'MEDIUM', age: 12 },
    pitStatus: 'GREEN',
    drsEnabled: false,
    lastLapTime: '1:23.456',
    personalBest: '1:22.123',
  },
  {
    position: 2,
    previousPosition: 3, // Gained 1 position
    driver: {
      id: 'hamilton',
      firstName: 'Lewis',
      lastName: 'Hamilton',
      fullName: 'Lewis Hamilton',
      number: 44,
      team: 'Mercedes',
    },
    team: 'Mercedes',
    gapToLeader: '+12.345',
    interval: '+12.345',
    tire: { compound: 'HARD', age: 25 },
    pitStatus: 'GREEN',
    drsEnabled: true,
    lastLapTime: '1:23.789',
    personalBest: '1:22.456',
  },
  {
    position: 3,
    previousPosition: 2, // Lost 1 position
    driver: {
      id: 'norris',
      firstName: 'Lando',
      lastName: 'Norris',
      fullName: 'Lando Norris',
      number: 4,
      team: 'McLaren',
    },
    team: 'McLaren',
    gapToLeader: '+18.234',
    interval: '+5.889',
    tire: { compound: 'SOFT', age: 8 },
    pitStatus: 'GREEN',
    drsEnabled: true,
    lastLapTime: '1:24.012',
    personalBest: '1:22.789',
  },
];

/**
 * Mock data for pit stop testing
 */
export const mockPittingDriver: LeaderboardEntry = {
  position: 5,
  previousPosition: 5,
  driver: {
    id: 'leclerc',
    firstName: 'Charles',
    lastName: 'Leclerc',
    fullName: 'Charles Leclerc',
    number: 16,
    team: 'Ferrari',
  },
  team: 'Ferrari',
  gapToLeader: '+24.567',
  interval: '+6.333',
  tire: { compound: 'MEDIUM', age: 15 },
  pitStatus: 'PITTING',
  drsEnabled: false,
  lastLapTime: '1:24.234',
  personalBest: '1:23.012',
};

/**
 * Mock data for lapped drivers testing
 */
export const mockLappedDrivers: LeaderboardEntry[] = [
  {
    position: 18,
    previousPosition: 18,
    driver: {
      id: 'albon',
      firstName: 'Alex',
      lastName: 'Albon',
      fullName: 'Alex Albon',
      number: 23,
      team: 'Williams',
    },
    team: 'Williams',
    gapToLeader: 'LAP',
    interval: '+1.234',
    tire: { compound: 'HARD', age: 30 },
    pitStatus: 'GREEN',
    drsEnabled: false,
  },
];
