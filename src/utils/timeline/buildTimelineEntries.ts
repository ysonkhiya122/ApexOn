/**
 * Timeline Entry Builder
 * 
 * Builds timeline entries INCREMENTALLY from race data.
 * 
 * Key Features:
 * - Only processes NEW items (not entire rebuild)
 * - Deduplication via Set-based tracking
 * - Max entry limit (100) for memory safety
 * - Newest-first sorting (critical for live UX)
 * 
 * This is the CORE of the timeline system.
 */

import type { TimelineEntry, TimelineState, RaceControlMessage, PitStop, RaceState, Driver } from '../../types/timeline.types';

const MAX_TIMELINE_ENTRIES = 100;

/**
 * Add NEW timeline entries incrementally.
 * 
 * @param currentState - Current timeline state with last processed IDs
 * @param raceControl - Latest race control messages
 * @param pitStops - Latest pit stop data
 * @param raceState - Current race state (for driver info)
 * @returns Updated timeline state with new entries
 */
export function addTimelineEntries(
  currentState: TimelineState,
  raceControl: RaceControlMessage[],
  pitStops: PitStop[],
  raceState: RaceState
): TimelineState {
  const newEntries: TimelineEntry[] = [];
  const seenIds = new Set(currentState.entries.map((e: TimelineEntry) => e.id));
  
  // Process NEW race control messages only
  const newRaceControl = raceControl.filter(
    msg => msg.id !== currentState.lastProcessedRaceControlId
  );
  
  newRaceControl.forEach((msg) => {
    const entryId = msg.id; // Already has 'rc-' prefix in mock data
    if (!seenIds.has(entryId)) {
      newEntries.push(createRaceControlEntry(msg));
      seenIds.add(entryId);
    }
  });
  
  // Process NEW pit stops only
  const newPitStops = pitStops.filter(
    stop => stop.id !== currentState.lastProcessedPitId
  );
  
  newPitStops.forEach((stop) => {
    const entryId = stop.id; // Already has 'pit-' prefix in mock data
    if (!seenIds.has(entryId)) {
      newEntries.push(createPitStopEntry(stop, raceState));
      seenIds.add(entryId);
    }
  });
  
  // Combine with existing entries
  const allEntries = [...currentState.entries, ...newEntries];
  
  // Sort: newest first (critical for live UX)
  allEntries.sort((a, b) => {
    if (a.lap !== b.lap) return b.lap - a.lap; // Newest lap first
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  // Limit to max entries (prevent memory issues)
  const limitedEntries = allEntries.slice(0, MAX_TIMELINE_ENTRIES);
  
  return {
    lastProcessedRaceControlId: raceControl.length > 0 
      ? raceControl[raceControl.length - 1].id 
      : currentState.lastProcessedRaceControlId,
    lastProcessedPitId: pitStops.length > 0 
      ? pitStops[pitStops.length - 1].id 
      : currentState.lastProcessedPitId,
    entries: limitedEntries,
  };
}

/**
 * Create race control timeline entry.
 * Messages are SHORT and SCANNABLE for live feed UX.
 */
function createRaceControlEntry(msg: RaceControlMessage): TimelineEntry {
  const { category, message, lap } = msg;
  
  return {
    id: `rc-${msg.id}`,
    lap,
    timestamp: msg.date,
    type: 'race_control',
    priority: getRaceControlPriority(category),
    message: formatShortRaceControlMessage(category),
    subMessage: message || undefined,
    icon: getRaceControlIcon(category),
    color: getRaceControlColor(category),
  };
}

/**
 * Create pit stop timeline entry.
 */
function createPitStopEntry(stop: PitStop, raceState: RaceState): TimelineEntry {
  const driver = raceState.drivers.find((d: Driver) => d.number === stop.driver_number);
  
  return {
    id: `pit-${stop.id}`,
    lap: stop.lap,
    timestamp: stop.date,
    type: 'pit_stop',
    priority: 'medium',
    message: `Lap ${stop.lap} • ${driver?.lastName || 'Unknown'} pits`,
    subMessage: `${stop.duration}s stop`,
    driverName: driver?.fullName,
    teamName: driver?.team,
    icon: 'pit-stop',
    color: 'orange',
  };
}

/**
 * Get race control priority (emotional hierarchy).
 * Critical events get more visual weight.
 */
function getRaceControlPriority(category: string): TimelineEntry['priority'] {
  if (category.includes('RED FLAG')) return 'critical';
  if (category.includes('SAFETY CAR')) return 'critical';
  if (category.includes('VIRTUAL SAFETY CAR')) return 'high';
  if (category.includes('YELLOW')) return 'high';
  if (category.includes('GREEN')) return 'low';
  if (category.includes('DRS')) return 'low';
  return 'medium';
}

/**
 * Format SHORT, scannable race control message.
 * Users skim live feeds rapidly - brevity is critical.
 */
function formatShortRaceControlMessage(category: string): string {
  const messages: Record<string, string> = {
    'SAFETY CAR': 'Safety Car deployed',
    'SAFETY CAR IN': 'Safety Car in this lap',
    'VIRTUAL SAFETY CAR': 'Virtual Safety Car',
    'VSC ENDS': 'VSC ending',
    'RED FLAG': 'Session stopped',
    'YELLOW FLAG': 'Yellow flag',
    'GREEN FLAG': 'Track clear',
    'DRS ENABLED': 'DRS enabled',
    'DRS DISABLED': 'DRS disabled',
    'OVERTAKE': 'Overtake',
    'DRIVER STUCK ON GRID': 'Driver stuck on grid',
  };
  
  for (const [key, value] of Object.entries(messages)) {
    if (category.includes(key)) return value;
  }
  
  return category;
}

/**
 * Get icon name for race control category.
 */
function getRaceControlIcon(category: string): string {
  if (category.includes('SAFETY CAR')) return 'safety-car';
  if (category.includes('RED')) return 'stop';
  if (category.includes('YELLOW')) return 'flag';
  if (category.includes('GREEN')) return 'check';
  if (category.includes('DRS')) return 'drs';
  if (category.includes('OVERTAKE')) return 'overtake';
  return 'info';
}

/**
 * Get color for race control category (visual hierarchy).
 */
function getRaceControlColor(category: string): string {
  if (category.includes('RED')) return 'red';
  if (category.includes('SAFETY CAR')) return 'orange';
  if (category.includes('VIRTUAL SAFETY CAR')) return 'orange';
  if (category.includes('YELLOW')) return 'yellow';
  if (category.includes('GREEN')) return 'green';
  if (category.includes('DRS')) return 'blue';
  return 'blue';
}
