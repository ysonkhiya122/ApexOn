/**
 * Live Timing Transformer
 * 
 * Transforms raw OpenF1 live timing data into normalized leaderboard entries.
 * 
 * Features:
 * - Position change detection
 * - Gap/interval formatting
 * - Tire compound parsing
 * - Pit status detection
 * - DRS status parsing
 */

import type { LeaderboardEntry, OpenF1LiveTiming, TireCompound, PitStatus } from '../../types/leaderboard.types';

/**
 * Tire compound color mapping
 */
const TIRE_COLORS: Record<string, string> = {
  SOFT: '#dc2626',
  MEDIUM: '#eab308',
  HARD: '#f1f5f9',
  INTERMEDIATE: '#10b981',
  WET: '#3b82f6',
};

/**
 * Tire compound short labels
 */
const TIRE_LABELS: Record<string, string> = {
  SOFT: 'S',
  MEDIUM: 'M',
  HARD: 'H',
  INTERMEDIATE: 'I',
  WET: 'W',
};

/**
 * Transform raw live timing to leaderboard entries
 */
export function transformLiveTiming(
  rawTiming: OpenF1LiveTiming,
  previousEntries: LeaderboardEntry[] = []
): LeaderboardEntry[] {
  if (!rawTiming?.data) {
    return [];
  }

  return rawTiming.data.map((driverData) => {
    // Find previous entry for position change detection
    const previousEntry = previousEntries.find(
      (e) => e.driver.number === driverData.driver_number
    );

    // Parse tire compound
    const compound = parseTireCompound(driverData.tire_compound || 'UNKNOWN');
    
    // Determine pit status
    const pitStatus = determinePitStatus(driverData);

    return {
      position: driverData.position,
      previousPosition: previousEntry?.position || driverData.position,
      driver: {
        id: `driver-${driverData.driver_number}`,
        firstName: 'Driver', // Would come from driver list
        lastName: `#${driverData.driver_number}`,
        fullName: `Driver #${driverData.driver_number}`,
        number: driverData.driver_number,
        team: '', // Would come from team list
      },
      team: 'Team', // Placeholder
      gapToLeader: formatGap(driverData.gap_to_leader),
      interval: formatGap(driverData.interval),
      tire: {
        compound,
        age: driverData.tire_age || 0,
      },
      pitStatus,
      drsEnabled: driverData.drs === 1,
      lastLapTime: driverData.last_lap_time,
      personalBest: driverData.best_lap_time,
    };
  });
}

/**
 * Parse tire compound string to enum
 */
function parseTireCompound(compound: string): TireCompound {
  const normalized = compound.toUpperCase();
  
  if (normalized.includes('SOFT')) return 'SOFT';
  if (normalized.includes('MEDIUM')) return 'MEDIUM';
  if (normalized.includes('HARD')) return 'HARD';
  if (normalized.includes('INTERMEDIATE')) return 'INTERMEDIATE';
  if (normalized.includes('WET') || normalized.includes('FULL')) return 'WET';
  
  return 'MEDIUM'; // Default fallback
}

/**
 * Determine pit status from timing data
 */
function determinePitStatus(driverData: any): PitStatus {
  if (driverData.pit_in && !driverData.pit_out) {
    return 'IN_PIT';
  }
  if (driverData.pit_out) {
    return 'JUST_PITTED';
  }
  if (driverData.pit_in && driverData.pit_out) {
    return 'PITTING'; // Currently in pit lane
  }
  return 'GREEN';
}

/**
 * Format gap/interval for display
 */
function formatGap(gap?: number): string {
  if (gap === undefined || gap === null) {
    return '---';
  }
  
  if (gap < 0) {
    return 'LAP'; // Lapped cars
  }
  
  if (gap === 0) {
    return 'LEADER';
  }
  
  return `+${gap.toFixed(3)}`;
}

/**
 * Get tire compound color
 */
export function getTireColor(compound: TireCompound): string {
  return TIRE_COLORS[compound] || '#64748b';
}

/**
 * Get tire compound label
 */
export function getTireLabel(compound: TireCompound): string {
  return TIRE_LABELS[compound] || '?';
}

/**
 * Calculate position change
 */
export function calculatePositionChange(
  current: number,
  previous: number
): { direction: 'up' | 'down' | 'same'; change: number; color: 'green' | 'red' | 'gray' } {
  const change = previous - current; // Positive = gained positions
  
  if (change > 0) {
    return { direction: 'up', change, color: 'green' };
  }
  if (change < 0) {
    return { direction: 'down', change: Math.abs(change), color: 'red' };
  }
  return { direction: 'same', change: 0, color: 'gray' };
}
