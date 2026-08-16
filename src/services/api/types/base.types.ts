/**
 * Base API Types
 *
 * These types represent the RAW API responses from external providers.
 * Components should NEVER use these directly.
 * Use normalized types from '../normalized/' instead.
 */

// ==================== Jolpica API Types ====================

export interface JolpicaResponse<T> {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    DriverTable?: T;
    ConstructorTable?: T;
    CircuitTable?: T;
    RaceTable?: T;
    StandingsTable?: T;
  };
}

export interface JolpicaDriver {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface JolpicaConstructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export interface JolpicaCircuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
}

export interface JolpicaRace {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: JolpicaCircuit;
  date: string;
  time?: string;
  Results?: JolpicaResult[];
}

export interface JolpicaResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: JolpicaDriver;
  Constructor: JolpicaConstructor;
  grid: string;
  laps: string;
  status: string;
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

export interface JolpicaStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver?: JolpicaDriver;
  Constructor?: JolpicaConstructor;
}

// ==================== OpenF1 API Types ====================

export interface OpenF1Session {
  session_key: number;
  meeting_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end?: string;
  gmt_offset: string;
}

export interface OpenF1TeamRadio {
  session_key: number;
  driver_number: number;
  date: string;
  recording_url: string;
}

export interface OpenF1Driver {
  driver_number: number;
  name: string;
  team: string;
}
