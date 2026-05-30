/**
 * Services Layer
 *
 * Central export for all API services, adapters, and types.
 *
 * This is the SINGLE source of truth for data access.
 * Components should import from here, NOT from random fetch calls.
 */

// Adapters (for data transformation)
export * from './api/adapters';

// Types (for type safety)
export * from './api/types';

// RTK Query Services (re-export for convenience)
export { jolpicaService } from '../store/services/jolpicaService';
export { openF1Service } from '../store/services/openF1Service';

// Jolpica hooks
export {
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
} from '../store/services/jolpicaService';

// OpenF1 hooks
export {
  useGetMeetingsQuery,
  useGetSessionsQuery,
  useGetDriversQuery as useGetOpenF1DriversQuery,
  useGetWeatherQuery,
  useGetTeamRadioQuery,
  useGetStintsQuery,
  useGetRaceControlQuery,
  useGetPitStopsQuery as useGetOpenF1PitStopsQuery,
  useGetPositionsQuery,
  useGetIntervalsQuery,
  useGetLapsQuery,
  useGetLiveTimingQuery,
} from '../store/services/openF1Service';
