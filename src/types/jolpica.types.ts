/**
 * Jolpica/Ergast-compatible API response types used by RTK Query services.
 */

import type {
  JolpicaCircuit,
  JolpicaConstructor,
  JolpicaDriver,
  JolpicaRace,
  JolpicaResponse,
  JolpicaResult,
  JolpicaStanding,
} from '@/services/api/types/base.types';

export type {
  JolpicaCircuit,
  JolpicaConstructor,
  JolpicaDriver,
  JolpicaRace,
  JolpicaResponse,
  JolpicaResult,
};

export interface JolpicaRaceTable {
  season?: string;
  round?: string;
  driverId?: string;
  constructorId?: string;
  circuitId?: string;
  Races: JolpicaRace[];
}

export interface JolpicaCircuitTable {
  season?: string;
  Circuits: JolpicaCircuit[];
}

export interface JolpicaDriverTable {
  season?: string;
  driverId?: string;
  Drivers: JolpicaDriver[];
}

export interface JolpicaConstructorTable {
  season?: string;
  constructorId?: string;
  Constructors: JolpicaConstructor[];
}

export interface JolpicaDriverStanding extends JolpicaStanding {
  Driver: JolpicaDriver;
  Constructors?: JolpicaConstructor[];
  Constructor?: JolpicaConstructor;
}

export interface JolpicaConstructorStanding extends JolpicaStanding {
  Constructor: JolpicaConstructor;
}

export interface JolpicaStandingsList {
  season: string;
  round?: string;
  DriverStandings?: JolpicaDriverStanding[];
  ConstructorStandings?: JolpicaConstructorStanding[];
}

export interface JolpicaStandingsTable {
  season?: string;
  StandingsLists?: JolpicaStandingsList[];
}

export interface JolpicaPitStop {
  driverId: string;
  lap: string;
  stop: string;
  time: string;
  duration: string;
}

export interface JolpicaRaceWithPitStops extends JolpicaRace {
  PitStops?: JolpicaPitStop[];
}

export interface JolpicaPitStopsRaceTable extends Omit<JolpicaRaceTable, 'Races'> {
  Races: JolpicaRaceWithPitStops[];
}

export type JolpicaScheduleResponse = JolpicaResponse<JolpicaRaceTable>;
export type JolpicaRaceResultsResponse = JolpicaResponse<JolpicaRaceTable>;
export type JolpicaCircuitsResponse = JolpicaResponse<JolpicaCircuitTable>;
export type JolpicaDriversResponse = JolpicaResponse<JolpicaDriverTable>;
export type JolpicaConstructorsResponse = JolpicaResponse<JolpicaConstructorTable>;
export type JolpicaStandingsResponse = JolpicaResponse<JolpicaStandingsTable>;
export type JolpicaPitStopsResponse = JolpicaResponse<JolpicaPitStopsRaceTable>;
