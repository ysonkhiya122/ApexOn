/**
 * Single source of truth for route paths.
 *
 * Import these instead of writing string literals so a rename is one edit and
 * a typo is a type error. `constants.ts` previously held a `ROUTES` map that
 * had drifted out of sync with the router (`/schedules`, `/history`) and was
 * imported by nothing — this replaces it.
 */
export const ROUTES = {
  HOME: '/',
  SCHEDULE: '/schedule',
  RESULTS: '/results',
  STANDINGS: '/standings',
  DRIVERS: '/drivers',
  TEAMS: '/teams',
  CIRCUITS: '/circuits',
  RULES: '/rules',
  ABOUT: '/about',
  GAMES: '/games',
  RACE_CENTER: '/race-center',
  LOGIN: '/login',
  REGISTER: '/register',
  NO_ACCESS: '/403',
} as const;

/** Development-only diagnostic screens. Never linked from production UI. */
export const DEV_ROUTES = {
  RACE_CENTER_TEST: '/race-center/test',
  LEADERBOARD_TEST: '/race-center/test-leaderboard',
  LIVE_DEBUG: '/race-center/debug',
} as const;

export const driverDetailPath = (driverId: string) => `${ROUTES.DRIVERS}/${driverId}`;
export const teamDetailPath = (teamId: string) => `${ROUTES.TEAMS}/${teamId}`;
export const circuitDetailPath = (circuitId: string) => `${ROUTES.CIRCUITS}/${circuitId}`;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
