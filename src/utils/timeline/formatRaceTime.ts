/**
 * Race Time Formatter
 *
 * Formats timestamps for timeline display.
 *
 * Priority:
 * 1. Relative race time (Lap 42) - BEST for race context
 * 2. Relative wall time (2 min ago) - Good for recent events
 * 3. Absolute time (04:32 PM) - Fallback for old events
 *
 * Users care about RACE context, not wall-clock time.
 */

/**
 * Format timestamp for timeline display.
 * Prefers race-relative time over wall-clock time.
 */
export function formatRaceTime(timestamp: string, lap?: number): string {
  // If lap is provided, use it (most relevant for racing)
  if (lap) {
    return `Lap ${lap}`;
  }

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  // Very recent (< 1 min)
  if (diffMins < 1) {
    return 'Just now';
  }

  // Recent (< 5 mins)
  if (diffMins === 1) {
    return '1 min ago';
  }
  if (diffMins < 5) {
    return `${diffMins} mins ago`;
  }

  // Recent (< 1 hour)
  if (diffMins < 60) {
    return `${diffMins} min ago`;
  }

  // Recent (< 24 hours)
  if (diffHours === 1) {
    return '1 hour ago';
  }
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  // Old events - show absolute time
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format lap number for display.
 */
export function formatLap(lap: number): string {
  return `Lap ${lap}`;
}

/**
 * Check if timestamp is from current session (today).
 */
export function isToday(timestamp: string): boolean {
  const date = new Date(timestamp);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
