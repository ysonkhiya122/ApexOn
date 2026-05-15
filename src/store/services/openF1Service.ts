import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { transformLiveTiming } from '../../utils/leaderboard/transformLiveTiming';

export const openF1Service = createApi({
  reducerPath: 'openF1Service',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.openf1.org/v1' }),
  endpoints: (builder) => ({
    getMeetings: builder.query<any, { year?: string; country_name?: string }>({
      query: (params) => ({
        url: '/meetings',
        params,
      }),
    }),
    getSessions: builder.query<any, { session_key?: string; meeting_key?: string; session_name?: string; year?: string }>({
      query: (params) => ({
        url: '/sessions',
        params,
      }),
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
    // Live Timing endpoint for leaderboard
    getLiveTiming: builder.query({
      query: (sessionKey: number) => ({
        url: '/live_timing',
        params: { session_key: sessionKey },
      }),
      transformResponse: (response: any) => {
        return transformLiveTiming(response);
      },
    }),
  }),
});

export const {
  useGetMeetingsQuery,
  useGetSessionsQuery,
  useGetDriversQuery,
  useGetWeatherQuery,
  useGetTeamRadioQuery,
  useGetStintsQuery,
  useGetLiveTimingQuery,
} = openF1Service;
