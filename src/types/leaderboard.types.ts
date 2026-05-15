/**
 * Leaderboard Types
 * 
 * Core types for live driver leaderboard.
 * Used throughout the leaderboard system for type safety.
 */

import type { Driver } from './timeline.types';

/**
 * Tire compound types
 */
export type TireCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET';

/**
 * Pit stop status
 */
export type PitStatus = 'GREEN' | 'PITTING' | 'JUST_PITTED' | 'IN_PIT';

/**
 * Position change direction
 */
export type PositionChange = 'GAINED' | 'LOST' | 'SAME';

/**
 * Leaderboard Entry
 * 
 * Represents a single driver in the live standings.
 */
export interface LeaderboardEntry {
  position: number;          // Current position (1-10)
  previousPosition: number;  // Previous position (for change detection)
  driver: Driver;            // Driver info
  team: string;              // Team name
  gapToLeader: string;       // "+12.345" or "LAP" (lapped)
  interval: string;          // Gap to car ahead "+2.345"
  tire: {
    compound: TireCompound;
    age: number;             // Laps on current set
  };
  pitStatus: PitStatus;
  drsEnabled: boolean;
  lastLapTime?: string;      // "1:23.456"
  personalBest?: string;     // "1:22.123"
}

/**
 * Position Change Indicator
 */
export interface PositionChangeIndicator {
  direction: 'up' | 'down' | 'same';
  change: number;  // +2, -1, 0
  color: 'green' | 'red' | 'gray';
}

/**
 * Tire Compound Display
 */
export interface TireCompoundDisplay {
  compound: TireCompound;
  color: string;       // Hex color for display
  age: number;
  label: string;       // Short label (S, M, H, I, W)
}

/**
 * Live Timing Data (from OpenF1 API)
 */
export interface OpenF1LiveTiming {
  session_key: number;
  timestamp: string;
  data: {
    driver_number: number;
    position: number;
    gap_to_leader?: number;
    interval?: number;
    last_lap_time?: string;
    best_lap_time?: string;
    tire_compound?: string;
    tire_age?: number;
    pit_in?: string;
    pit_out?: string;
    drs?: number;
  }[];
}

/**
 * Leaderboard State (Redux)
 */
export interface LeaderboardState {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
  lastUpdate: number;
  sessionStatus: 'scheduled' | 'live' | 'completed' | 'aborted';
}
