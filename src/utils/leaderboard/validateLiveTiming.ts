/**
 * Live Timing Validation Layer
 * 
 * CRITICAL: This prevents crashes from imperfect API data.
 * 
 * Validates OpenF1 API responses and ensures safe defaults.
 */

import type { LeaderboardEntry, TireCompound, PitStatus } from '../../types/leaderboard.types';

/**
 * Validate a single driver entry.
 * 
 * REQUIRED fields:
 * - driver (with driver_number)
 * - position
 * 
 * Everything else is optional with safe defaults.
 */
export function validateDriverEntry(entry: any): boolean {
  // CRITICAL: Must have these fields
  if (entry == null) {
    return false;
  }
  
  if (entry.position == null) {
    return false;
  }
  
  // Driver can be nested or flat
  const hasDriver = entry.driver?.driver_number != null || entry.driver_number != null;
  if (!hasDriver) {
    return false;
  }
  
  return true;
}

/**
 * Validate entire leaderboard response.
 * 
 * Returns safe, validated array even if API returns garbage.
 */
export function validateLeaderboardResponse(response: any): LeaderboardEntry[] {
  // Handle null/undefined
  if (!response) {
    return [];
  }
  
  // Handle non-array
  if (!Array.isArray(response)) {
    return [];
  }
  
  // Validate each entry
  return response
    .filter(validateDriverEntry)
    .map(normalizeDriverEntry);
}

/**
 * Normalize driver entry with safe defaults.
 * 
 * This ensures UI never crashes from undefined.
 */
function normalizeDriverEntry(entry: any): LeaderboardEntry {
  // Extract driver info (handle nested or flat structure)
  const driverInfo = entry.driver || {};
  const driverNumber = driverInfo.number || driverInfo.driver_number || entry.driver_number || 0;
  const firstName = driverInfo.firstName || driverInfo.givenName || 'Unknown';
  const lastName = driverInfo.lastName || driverInfo.familyName || 'Driver';
  
  return {
    // REQUIRED
    position: entry.position ?? 0,
    previousPosition: entry.previousPosition ?? entry.position ?? 0,
    driver: {
      id: `driver-${driverNumber}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      number: driverNumber,
      team: driverInfo.team ?? entry.team ?? 'Unknown',
    },
    team: driverInfo.team ?? entry.team ?? 'Unknown',
    
    // OPTIONAL (with safe defaults)
    gapToLeader: (entry.gapToLeader ?? '---') as string,
    interval: (entry.interval ?? '---') as string,
    tire: {
      compound: ((entry.tire?.compound ?? 'UNKNOWN') as TireCompound),
      age: entry.tire?.age ?? 0,
    },
    pitStatus: ((entry.pitStatus ?? 'GREEN') as PitStatus),
    drsEnabled: entry.drsEnabled ?? false,
  };
}

/**
 * Validate session data.
 */
export function validateSessionData(session: any): boolean {
  if (session == null) {
    return false;
  }
  
  if (session.session_key == null) {
    return false;
  }
  
  return true;
}

/**
 * Check if data is stale.
 */
export function isDataStale(lastUpdate: number, thresholdMs: number = 10000): boolean {
  return Date.now() - lastUpdate > thresholdMs;
}
