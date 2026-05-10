/**
 * Services Layer
 * 
 * Central export for all API services, adapters, and types.
 * 
 * This is the SINGLE source of truth for data access.
 * Components should import from here, NOT from store/services directly.
 */

// Adapters (for data transformation)
export * from './api/adapters';

// Types (for type safety)
export * from './api/types';

// RTK Query Services (re-export for convenience)
export { jolpicaService } from '../store/services/jolpicaService';
export { openF1Service } from '../store/services/openF1Service';

// Re-export hooks for easy importing
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

export {
  useGetSessionsQuery,
  useGetDriversQuery as useGetOpenF1DriversQuery,
  useGetWeatherQuery,
  useGetTeamRadioQuery,
  useGetStintsQuery,
} from '../store/services/openF1Service';
