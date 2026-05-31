import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  transformConstructorStandings,
  transformDriverStandings,
  transformDrivers,
  transformRaces,
} from '@/services/api/adapters';
import type { ConstructorStanding, Driver, DriverStanding, Race } from '@/services/api/types/normalized.types';
import type {
  JolpicaCircuitsResponse,
  JolpicaConstructorsResponse,
  JolpicaDriversResponse,
  JolpicaPitStopsResponse,
  JolpicaRaceResultsResponse,
  JolpicaScheduleResponse,
  JolpicaStandingsResponse,
} from '@/types/jolpica.types';

const JOLPICA_BASE_URL = import.meta.env.VITE_JOLPICA_BASE_URL || 'https://api.jolpi.ca/ergast/f1';

export interface JolpicaRaceRequest {
  year: string;
  round: string;
}

const emptySchedule = (response: JolpicaScheduleResponse): Race[] =>
  transformRaces(response?.MRData?.RaceTable?.Races || []);

const emptyDriverStandings = (response: JolpicaStandingsResponse): DriverStanding[] =>
  transformDriverStandings(
    response?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || []
  );

const emptyConstructorStandings = (response: JolpicaStandingsResponse): ConstructorStanding[] =>
  transformConstructorStandings(
    response?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || []
  );

export const jolpicaService = createApi({
  reducerPath: 'jolpicaService',
  baseQuery: fetchBaseQuery({ baseUrl: JOLPICA_BASE_URL }),
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getSchedule: builder.query<Race[], string>({
      query: (year) => `/${year}.json`,
      transformResponse: emptySchedule,
    }),
    getDriverStandings: builder.query<DriverStanding[], string>({
      query: (year) => `/${year}/driverStandings.json`,
      transformResponse: emptyDriverStandings,
    }),
    getConstructorStandings: builder.query<ConstructorStanding[], string>({
      query: (year) => `/${year}/constructorStandings.json`,
      transformResponse: emptyConstructorStandings,
    }),
    getRaceResults: builder.query<JolpicaRaceResultsResponse, JolpicaRaceRequest>({
      query: ({ year, round }) => `/${year}/${round}/results.json`,
    }),
    getCircuits: builder.query<JolpicaCircuitsResponse, string>({
      query: (year) => `/${year}/circuits.json`,
    }),
    getPitStops: builder.query<JolpicaPitStopsResponse, JolpicaRaceRequest>({
      query: ({ year, round }) => `/${year}/${round}/pitstops.json`,
    }),
    getDrivers: builder.query<Driver[], string>({
      query: (year) => `/${year}/drivers.json`,
      transformResponse: (response: JolpicaDriversResponse) =>
        transformDrivers(response?.MRData?.DriverTable?.Drivers || []),
    }),
    getDriverDetails: builder.query<JolpicaDriversResponse, string>({
      query: (driverId) => `/drivers/${driverId}.json`,
    }),
    getDriverResults: builder.query<JolpicaRaceResultsResponse, string>({
      query: (driverId) => `/drivers/${driverId}/results.json`,
    }),
    getConstructors: builder.query<JolpicaConstructorsResponse, string>({
      query: (year) => `/${year}/constructors.json`,
    }),
    getConstructorResults: builder.query<JolpicaRaceResultsResponse & JolpicaConstructorsResponse, string>({
      query: (constructorId) => `/constructors/${constructorId}/results.json`,
    }),
    getCircuitResults: builder.query<JolpicaRaceResultsResponse & JolpicaCircuitsResponse, string>({
      query: (circuitId) => `/circuits/${circuitId}/results.json`,
    }),
  }),
});

export const {
  useGetScheduleQuery,
  useGetDriverStandingsQuery,
  useGetConstructorStandingsQuery,
  useGetRaceResultsQuery,
  useGetCircuitsQuery,
  useGetPitStopsQuery,
  useGetDriversQuery,
  useGetDriverDetailsQuery,
  useGetDriverResultsQuery,
  useGetConstructorsQuery,
  useGetConstructorResultsQuery,
  useGetCircuitResultsQuery,
} = jolpicaService;
