import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  transformRaces,
  transformDriverStandings,
  transformConstructorStandings,
} from '@/services/api/adapters'

export const jolpicaService = createApi({
  reducerPath: 'jolpicaService',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.jolpi.ca/ergast/f1' }),
  endpoints: (builder) => ({
    getSchedule: builder.query({
      query: (year) => `/${year}.json`,
      transformResponse: (response: any) => {
        return transformRaces(response?.MRData?.RaceTable?.Races || [])
      },
    }),
    getDriverStandings: builder.query<any, string>({
      query: (year) => `/${year}/driverStandings.json`,
      transformResponse: (response: any) => {
        const standings =
          response?.MRData?.StandingsTable?.StandingsList?.[0]?.DriverStandings || []
        return transformDriverStandings(standings)
      },
    }),
    getConstructorStandings: builder.query<any, string>({
      query: (year) => `/${year}/constructorStandings.json`,
      transformResponse: (response: any) => {
        const standings =
          response?.MRData?.StandingsTable?.StandingsList?.[0]?.ConstructorStandings || []
        return transformConstructorStandings(standings)
      },
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
    getCircuitResults: builder.query<any, string>({
      query: (circuitId) => `/circuits/${circuitId}/results.json`,
    }),
  }),
})

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
} = jolpicaService
