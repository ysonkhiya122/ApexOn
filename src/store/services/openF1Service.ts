import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { validateLeaderboardResponse } from '../../utils/leaderboard/validateLiveTiming';

export const openF1Service = createApi({
  reducerPath: 'openF1Service',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.openf1.org/v1' }),
  endpoints: (builder) => ({
    // Session discovery - CRITICAL for live system
    getSessions: builder.query({
      query: () => '/sessions?session_key=latest',
      // Cache for 1 minute
      keepUnusedDataFor: 60,
    }),
    getDrivers: builder.query<any, { session_key?: string; driver_number?: number }>({
      query: (params) => ({
        url: '/drivers',
        params,
      }),
    }),
    getWeather: builder.query<any, { session_key: string }>({
      query: (params) => ({
        url: '/weather',
        params,
      }),
    }),
    getTeamRadio: builder.query<any, { session_key: string; driver_number?: string | number }>({
      query: (params) => ({
        url: '/team_radio',
        params,
      }),
    }),
    getStints: builder.query<any, { session_key: string; driver_number?: number }>({
      query: (params) => ({
        url: '/stints',
        params,
      }),
    }),
    // Live Timing endpoint for leaderboard - WITH VALIDATION
    getLiveTiming: builder.query({
      query: (sessionKey: number) => ({
        url: '/live_timing',
        params: { session_key: sessionKey },
      }),
      transformResponse: (response: any) => {
        // VALIDATION LAYER - prevents crashes
        return validateLeaderboardResponse(response);
      },
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useGetDriversQuery,
  useGetWeatherQuery,
  useGetTeamRadioQuery,
  useGetStintsQuery,
  useGetLiveTimingQuery,
} = openF1Service;
