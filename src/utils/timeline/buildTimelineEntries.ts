/**
 * Timeline Entry Builder
 *
 * Builds timeline entries incrementally from race data.
 *
 * Key Features:
 * - Processes only unseen event IDs
 * - Deduplicates against the final React/render IDs
 * - Caps entries for memory safety
 * - Keeps newest events first
 */

import type {
  Driver,
  PitStop,
  RaceControlMessage,
  RaceState,
  TimelineEntry,
  TimelineState,
} from '../../types/timeline.types';

const MAX_TIMELINE_ENTRIES = 100;

const withPrefix = (prefix: 'rc' | 'pit', id: string) =>
  id.startsWith(`${prefix}-`) ? id : `${prefix}-${id}`;

/**
 * Add new timeline entries incrementally.
 *
 * The important detail: `seenIds` must compare the same ID that React receives
 * as `key`. Earlier code compared raw pit/race-control IDs but rendered
 * prefixed IDs, which allowed duplicates on every polling refresh.
 */
export function addTimelineEntries(
  currentState: TimelineState,
  raceControl: RaceControlMessage[],
  pitStops: PitStop[],
  raceState: RaceState
): TimelineState {
  const newEntries: TimelineEntry[] = [];
  const seenIds = new Set(currentState.entries.map((entry) => entry.id));

  raceControl.forEach((message) => {
    const entryId = withPrefix('rc', message.id);

    if (!seenIds.has(entryId)) {
      newEntries.push(createRaceControlEntry(message));
      seenIds.add(entryId);
    }
  });

  pitStops.forEach((stop) => {
    const entryId = withPrefix('pit', stop.id);

    if (!seenIds.has(entryId)) {
      newEntries.push(createPitStopEntry(stop, raceState));
      seenIds.add(entryId);
    }
  });

  const allEntries = [...currentState.entries, ...newEntries];

  allEntries.sort((a, b) => {
    if (a.lap !== b.lap) return b.lap - a.lap;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const limitedEntries = allEntries.slice(0, MAX_TIMELINE_ENTRIES);

  return {
    lastProcessedRaceControlId:
      raceControl.length > 0
        ? withPrefix('rc', raceControl[raceControl.length - 1].id)
        : currentState.lastProcessedRaceControlId,
    lastProcessedPitId:
      pitStops.length > 0
        ? withPrefix('pit', pitStops[pitStops.length - 1].id)
        : currentState.lastProcessedPitId,
    entries: limitedEntries,
  };
}

/**
 * Create race control timeline entry.
 * Messages are short and scannable for live feed UX.
 */
function createRaceControlEntry(message: RaceControlMessage): TimelineEntry {
  const { category, message: body, lap } = message;

  return {
    id: withPrefix('rc', message.id),
    lap,
    timestamp: message.date,
    type: 'race_control',
    priority: getRaceControlPriority(category),
    message: formatShortRaceControlMessage(category),
    subMessage: body || undefined,
    icon: getRaceControlIcon(category),
    color: getRaceControlColor(category),
  };
}

/**
 * Create pit stop timeline entry.
 */
function createPitStopEntry(stop: PitStop, raceState: RaceState): TimelineEntry {
  const driver = raceState.drivers.find((item: Driver) => item.number === stop.driver_number);

  return {
    id: withPrefix('pit', stop.id),
    lap: stop.lap,
    timestamp: stop.date,
    type: 'pit_stop',
    priority: 'medium',
    message: `Lap ${stop.lap} • ${driver?.lastName || `#${stop.driver_number}`} pits`,
    subMessage: stop.duration > 0 ? `${stop.duration}s stop` : 'Pit lane activity',
    driverName: driver?.fullName,
    teamName: driver?.team,
    icon: 'pit-stop',
    color: 'orange',
  };
}

function getRaceControlPriority(category: string): TimelineEntry['priority'] {
  if (category.includes('RED FLAG')) return 'critical';
  if (category.includes('SAFETY CAR')) return 'critical';
  if (category.includes('VIRTUAL SAFETY CAR')) return 'high';
  if (category.includes('YELLOW')) return 'high';
  if (category.includes('GREEN')) return 'low';
  if (category.includes('DRS')) return 'low';
  return 'medium';
}

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
    OVERTAKE: 'Overtake',
    'DRIVER STUCK ON GRID': 'Driver stuck on grid',
  };

  for (const [key, value] of Object.entries(messages)) {
    if (category.includes(key)) return value;
  }

  return category;
}

function getRaceControlIcon(category: string): string {
  if (category.includes('SAFETY CAR')) return 'safety-car';
  if (category.includes('RED')) return 'stop';
  if (category.includes('YELLOW')) return 'flag';
  if (category.includes('GREEN')) return 'check';
  if (category.includes('DRS')) return 'drs';
  if (category.includes('OVERTAKE')) return 'overtake';
  return 'info';
}

function getRaceControlColor(category: string): string {
  if (category.includes('RED')) return 'red';
  if (category.includes('SAFETY CAR')) return 'orange';
  if (category.includes('VIRTUAL SAFETY CAR')) return 'orange';
  if (category.includes('YELLOW')) return 'yellow';
  if (category.includes('GREEN')) return 'green';
  if (category.includes('DRS')) return 'blue';
  return 'blue';
}
