import {
  createApi,
  fetchBaseQuery,
  retry,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { validateLeaderboardResponse } from '../../utils/leaderboard/validateLiveTiming';

const OPENF1_BASE_URL = import.meta.env.VITE_OPENF1_BASE_URL || 'https://api.openf1.org/v1';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: OPENF1_BASE_URL,
  timeout: 10000,
});

/**
 * OpenF1 is public and can rate-limit aggressively. Retrying 429 responses only
 * makes the situation worse, so fail fast on 429 and let the UI show a graceful
 * stale/partial data state.
 */
const baseQueryWithRateLimitGuard: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 429) {
    retry.fail(result.error, result.meta);
  }

  return result;
};

const baseQuery = retry(baseQueryWithRateLimitGuard, { maxRetries: 2 });

type QueryParams = Record<string, string | number | boolean | undefined>;

const hasParams = (params?: QueryParams) =>
  !!params && Object.values(params).some((value) => value !== undefined && value !== '');

const latestPositionByDriver = (response: any) => {
  if (!Array.isArray(response)) return [];

  const latest = new Map<number, any>();

  response.forEach((entry) => {
    const driverNumber = entry?.driver_number;
    if (driverNumber == null) return;

    const previous = latest.get(driverNumber);
    const entryTime = new Date(entry?.date || entry?.timestamp || 0).getTime();
    const previousTime = new Date(previous?.date || previous?.timestamp || 0).getTime();

    if (!previous || entryTime >= previousTime) {
      latest.set(driverNumber, entry);
    }
  });

  return Array.from(latest.values()).sort((a, b) => (a.position ?? 999) - (b.position ?? 999));
};

export const openF1Service = createApi({
  reducerPath: 'openF1Service',
  baseQuery,
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getMeetings: builder.query<any[], QueryParams | void>({
      query: (params) => {
        const safeParams = params as QueryParams | undefined;
        return {
          url: '/meetings',
          params: hasParams(safeParams) ? safeParams : undefined,
        };
      },
    }),
    getSessions: builder.query<any[], QueryParams | void>({
      query: (params) => {
        const safeParams = params as QueryParams | undefined;
        return {
          url: '/sessions',
          params: hasParams(safeParams) ? safeParams : { session_key: 'latest' },
        };
      },
    }),
    getDrivers: builder.query<any[], { session_key?: string | number; driver_number?: number }>({
      query: (params) => ({
        url: '/drivers',
        params,
      }),
    }),
    getWeather: builder.query<any[], { session_key: string | number }>({
      query: (params) => ({
        url: '/weather',
        params,
      }),
    }),
    getTeamRadio: builder.query<any[], { session_key: string | number; driver_number?: string | number }>({
      query: (params) => ({
        url: '/team_radio',
        params,
      }),
    }),
    getStints: builder.query<any[], { session_key: string | number; driver_number?: number }>({
      query: (params) => ({
        url: '/stints',
        params,
      }),
    }),
    getRaceControl: builder.query<any[], { session_key: string | number }>({
      query: (params) => ({
        url: '/race_control',
        params,
      }),
    }),
    getPitStops: builder.query<any[], { session_key: string | number; driver_number?: number }>({
      query: (params) => ({
        url: '/pit',
        params,
      }),
    }),
    getPositions: builder.query<any[], { session_key: string | number; driver_number?: number }>({
      query: (params) => ({
        url: '/position',
        params,
      }),
    }),
    getIntervals: builder.query<any[], { session_key: string | number; driver_number?: number }>({
      query: (params) => ({
        url: '/intervals',
        params,
      }),
    }),
    getLaps: builder.query<any[], { session_key: string | number; driver_number?: number }>({
      query: (params) => ({
        url: '/laps',
        params,
      }),
    }),
    /**
     * Compatibility hook for the Race Center leaderboard. OpenF1 does not expose
     * `/live_timing`; we read `/position`, keep the latest row per driver, and
     * validate it into safe leaderboard entries.
     */
    getLiveTiming: builder.query<any[], string | number>({
      query: (sessionKey) => ({
        url: '/position',
        params: { session_key: sessionKey },
      }),
      transformResponse: (response: any) => validateLeaderboardResponse(latestPositionByDriver(response)),
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
  useGetRaceControlQuery,
  useGetPitStopsQuery,
  useGetPositionsQuery,
  useGetIntervalsQuery,
  useGetLapsQuery,
  useGetLiveTimingQuery,
} = openF1Service;
