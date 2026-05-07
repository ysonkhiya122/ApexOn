import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const jolpicaService = createApi({
  reducerPath: 'jolpicaService',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.jolpi.ca/ergast/f1' }),
  endpoints: (builder) => ({
    getSchedule: builder.query<any, string>({
      query: (year) => `/${year}.json`,
    }),
    getDriverStandings: builder.query<any, string>({
      query: (year) => `/${year}/driverStandings.json`,
    }),
    getConstructorStandings: builder.query<any, string>({
      query: (year) => `/${year}/constructorStandings.json`,
    }),
    getRaceResults: builder.query<any, { year: string; round: string }>({
      query: ({ year, round }) => `/${year}/${round}/results.json`,
    }),
    getCircuits: builder.query<any, string>({
      query: (year) => `/${year}/circuits.json`,
    }),
    getPitStops: builder.query<any, { year: string; round: string }>({
      query: ({ year, round }) => `/${year}/${round}/pitstops.json`,
    }),
    getDrivers: builder.query<any, string>({
      query: (year) => `/${year}/drivers.json`,
    }),
    getDriverDetails: builder.query<any, string>({
      query: (driverId) => `/drivers/${driverId}.json`,
    }),
    getDriverResults: builder.query<any, string>({
      query: (driverId) => `/drivers/${driverId}/results.json`,
    }),
    getConstructors: builder.query<any, string>({
      query: (year) => `/${year}/constructors.json`,
    }),
    getConstructorResults: builder.query<any, string>({
      query: (constructorId) => `/constructors/${constructorId}/results.json`,
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
} = jolpicaService;
