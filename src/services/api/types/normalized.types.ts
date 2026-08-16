/**
 * Normalized API Types
 *
 * These types represent CLEAN, normalized data models.
 * Components should ONLY use these types.
 * Adapters transform raw API data into these models.
 */

// ==================== Driver Types ====================

export interface Driver {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  code: string;
  number: number;
  nationality: string;
  dateOfBirth: string;
  team?: string;
}

export interface DriverStats {
  driverId: string;
  championships: number;
  raceWins: number;
  podiums: number;
  polePositions: number;
  fastestLaps: number;
  careerPoints: number;
  racesEntered: number;
}

export interface DriverSeasonResult {
  season: number;
  team: string;
  points: number;
  position: number;
  races: number;
  wins: number;
}

// ==================== Team Types ====================

export interface Team {
  id: string;
  name: string;
  nationality: string;
  fullName: string;
}

export interface TeamStats {
  teamId: string;
  championships: number;
  raceWins: number;
  podiums: number;
  polePositions: number;
  totalPoints: number;
  seasonsCompeted: number;
}

export interface TeamSeasonResult {
  season: number;
  points: number;
  position: number;
  wins: number;
  races: number;
}

// ==================== Circuit Types ====================

export interface Circuit {
  id: string;
  name: string;
  locality: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CircuitStats {
  circuitId: string;
  firstGrandPrix: number;
  totalRaces: number;
  lapRecord?: LapRecord;
  mostWins: MostWins[];
}

export interface LapRecord {
  time: string;
  driver: string;
  year: number;
}

export interface MostWins {
  driver: string;
  wins: number;
}

// ==================== Race Types ====================

export interface Race {
  id: string;
  season: number;
  round: number;
  name: string;
  circuit: Circuit;
  date: string;
  time?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface RaceResult {
  position: number;
  driver: Driver;
  team: Team;
  points: number;
  grid: number;
  laps: number;
  status: string;
  time?: string;
  fastestLap?: FastestLap;
}

export interface FastestLap {
  rank: number;
  lap: number;
  time: string;
  speed: number;
}

// ==================== Standings Types ====================

export interface DriverStanding {
  position: number;
  driver: Driver;
  team: string; // Team name as string, not object
  points: number;
  wins: number;
}

export interface ConstructorStanding {
  position: number;
  team: Team;
  points: number;
  wins: number;
}

// ==================== Session Types ====================

export interface Session {
  id: number;
  name: string;
  type: string;
  startDate: string;
  endDate?: string;
  meetingId: number;
}

export interface TeamRadio {
  sessionId: number;
  driverNumber: number;
  date: string;
  recordingUrl: string;
}

// ==================== Pit Stop Types ====================

export interface PitStop {
  stop: number;
  driverId: string;
  lap: number;
  duration: number;
  time: string;
}
