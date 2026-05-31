import {
  createApi,
  fetchBaseQuery,
  retry,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { LeaderboardEntry } from '../../types/leaderboard.types';
import type {
  OpenF1Driver,
  OpenF1Interval,
  OpenF1Lap,
  OpenF1Meeting,
  OpenF1PitStop,
  OpenF1Position,
  OpenF1QueryParams,
  OpenF1RaceControlMessage,
  OpenF1Session,
  OpenF1Stint,
  OpenF1TeamRadio,
  OpenF1Weather,
} from '../../types/openf1.types';
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

const hasParams = (params?: OpenF1QueryParams) =>
  !!params && Object.values(params).some((value) => value !== undefined && value !== '');

const latestPositionByDriver = (response: OpenF1Position[] | unknown): OpenF1Position[] => {
  if (!Array.isArray(response)) return [];

  const latest = new Map<number, OpenF1Position>();

  response.forEach((entry) => {
    const positionEntry = entry as Partial<OpenF1Position>;
    const driverNumber = positionEntry.driver_number;
    if (driverNumber == null || positionEntry.position == null) return;

    const previous = latest.get(driverNumber);
    const entryTime = new Date(positionEntry.date || positionEntry.timestamp || 0).getTime();
    const previousTime = new Date(previous?.date || previous?.timestamp || 0).getTime();

    if (!previous || entryTime >= previousTime) {
      latest.set(driverNumber, positionEntry as OpenF1Position);
    }
  });

  return Array.from(latest.values()).sort((a, b) => (a.position ?? 999) - (b.position ?? 999));
};

export interface OpenF1SessionQuery extends OpenF1QueryParams {
  session_key?: string | number;
  meeting_key?: string | number;
  session_name?: string;
  year?: string | number;
}

export interface OpenF1DriverQuery extends OpenF1QueryParams {
  session_key?: string | number;
  driver_number?: number;
}

export interface OpenF1SessionScopedQuery extends OpenF1QueryParams {
  session_key: string | number;
}

export interface OpenF1DriverScopedQuery extends OpenF1SessionScopedQuery {
  driver_number?: string | number;
}

export const openF1Service = createApi({
  reducerPath: 'openF1Service',
  baseQuery,
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getMeetings: builder.query<OpenF1Meeting[], OpenF1QueryParams | void>({
      query: (params) => {
        const safeParams = params as OpenF1QueryParams | undefined;
        return {
          url: '/meetings',
          params: hasParams(safeParams) ? safeParams : undefined,
        };
      },
    }),
    getSessions: builder.query<OpenF1Session[], OpenF1SessionQuery | void>({
      query: (params) => {
        const safeParams = params as OpenF1SessionQuery | undefined;
        return {
          url: '/sessions',
          params: hasParams(safeParams) ? safeParams : { session_key: 'latest' },
        };
      },
    }),
    getDrivers: builder.query<OpenF1Driver[], OpenF1DriverQuery>({
      query: (params) => ({
        url: '/drivers',
        params,
      }),
    }),
    getWeather: builder.query<OpenF1Weather[], OpenF1SessionScopedQuery>({
      query: (params) => ({
        url: '/weather',
        params,
      }),
    }),
    getTeamRadio: builder.query<OpenF1TeamRadio[], OpenF1DriverScopedQuery>({
      query: (params) => ({
        url: '/team_radio',
        params,
      }),
    }),
    getStints: builder.query<OpenF1Stint[], OpenF1DriverScopedQuery>({
      query: (params) => ({
        url: '/stints',
        params,
      }),
    }),
    getRaceControl: builder.query<OpenF1RaceControlMessage[], OpenF1SessionScopedQuery>({
      query: (params) => ({
        url: '/race_control',
        params,
      }),
    }),
    getPitStops: builder.query<OpenF1PitStop[], OpenF1DriverScopedQuery>({
      query: (params) => ({
        url: '/pit',
        params,
      }),
    }),
    getPositions: builder.query<OpenF1Position[], OpenF1DriverScopedQuery>({
      query: (params) => ({
        url: '/position',
        params,
      }),
    }),
    getIntervals: builder.query<OpenF1Interval[], OpenF1DriverScopedQuery>({
      query: (params) => ({
        url: '/intervals',
        params,
      }),
    }),
    getLaps: builder.query<OpenF1Lap[], OpenF1DriverScopedQuery>({
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
    getLiveTiming: builder.query<LeaderboardEntry[], string | number>({
      query: (sessionKey) => ({
        url: '/position',
        params: { session_key: sessionKey },
      }),
      transformResponse: (response: OpenF1Position[] | unknown) =>
        validateLeaderboardResponse(latestPositionByDriver(response)),
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
