/**
 * APexOn API Type Definitions
 * 
 * This file defines shared types for future backend API integration.
 * All external API responses should be normalized to these types.
 */

export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp: string;
    source: 'jolpica' | 'openf1' | 'internal';
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Driver {
  id: string;
  driverId: string;
  permanentNumber?: number;
  code: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  team?: string;
}

export interface Team {
  id: string;
  constructorId: string;
  name: string;
  nationality: string;
  url?: string;
}

export interface Circuit {
  id: string;
  circuitId: string;
  circuitName: string;
  location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
  url?: string;
}

export interface Race {
  season: string;
  round: string;
  url?: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time?: string;
  Results?: RaceResult[];
}

export interface RaceResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Team;
  grid: string;
  laps: string;
  status?: string;
  Time?: {
    millis: string;
    time: string;
  };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: {
      time: string;
    };
    AverageSpeed: {
      units: string;
      speed: string;
    };
  };
}

export interface StandingsEntry {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver?: Driver;
  Constructor?: Team;
}

export interface DriverStandings {
  season: string;
  round?: string;
  StandingsLists: {
    season: string;
    round: string;
    DriverStandings: StandingsEntry[];
  }[];
}

export interface ConstructorStandings {
  season: string;
  round?: string;
  StandingsLists: {
    season: string;
    round: string;
    ConstructorStandings: StandingsEntry[];
  }[];
}

export interface Session {
  session_key: number;
  meeting_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end?: string;
  gmt_offset: string;
}

export interface TeamRadio {
  session_key: number;
  driver_number: number;
  date: string;
  recording_url: string;
}
