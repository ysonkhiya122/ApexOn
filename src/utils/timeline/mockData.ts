/**
 * Mock Timeline Data
 * 
 * For testing timeline functionality without live API.
 * Simulates various race events with different priorities.
 */

import type { TimelineEntry, RaceControlMessage, PitStop, Driver } from '../../types/timeline.types';

/**
 * Mock drivers for testing
 */
export const mockDrivers: Driver[] = [
  { id: 'verstappen', firstName: 'Max', lastName: 'Verstappen', fullName: 'Max Verstappen', number: 1, team: 'Red Bull Racing' },
  { id: 'hamilton', firstName: 'Lewis', lastName: 'Hamilton', fullName: 'Lewis Hamilton', number: 44, team: 'Mercedes' },
  { id: 'norris', firstName: 'Lando', lastName: 'Norris', fullName: 'Lando Norris', number: 4, team: 'McLaren' },
  { id: 'leclerc', firstName: 'Charles', lastName: 'Leclerc', fullName: 'Charles Leclerc', number: 16, team: 'Ferrari' },
  { id: 'sainz', firstName: 'Carlos', lastName: 'Sainz', fullName: 'Carlos Sainz', number: 55, team: 'Ferrari' },
];

/**
 * Mock race control messages (various priorities)
 */
export const mockRaceControl: RaceControlMessage[] = [
  {
    id: 'rc-1',
    session_key: 9158,
    lap: 1,
    date: new Date(Date.now() - 3600000).toISOString(),
    category: 'GREEN FLAG',
    message: 'Race started',
  },
  {
    id: 'rc-2',
    session_key: 9158,
    lap: 12,
    date: new Date(Date.now() - 2400000).toISOString(),
    category: 'YELLOW FLAG',
    message: 'Turn 4 - debris',
  },
  {
    id: 'rc-3',
    session_key: 9158,
    lap: 15,
    date: new Date(Date.now() - 1800000).toISOString(),
    category: 'SAFETY CAR',
    message: 'Deployed - Turn 8 incident',
  },
  {
    id: 'rc-4',
    session_key: 9158,
    lap: 20,
    date: new Date(Date.now() - 1200000).toISOString(),
    category: 'SAFETY CAR IN',
    message: 'This lap',
  },
  {
    id: 'rc-5',
    session_key: 9158,
    lap: 35,
    date: new Date(Date.now() - 600000).toISOString(),
    category: 'RED FLAG',
    message: 'Session stopped - major incident',
  },
];

/**
 * Mock pit stops
 */
export const mockPitStops: PitStop[] = [
  {
    id: 'pit-1',
    session_key: 9158,
    driver_number: 1,
    lap: 18,
    date: new Date(Date.now() - 2100000).toISOString(),
    duration: 2.3,
  },
  {
    id: 'pit-2',
    session_key: 9158,
    driver_number: 44,
    lap: 19,
    date: new Date(Date.now() - 2000000).toISOString(),
    duration: 2.5,
  },
  {
    id: 'pit-3',
    session_key: 9158,
    driver_number: 4,
    lap: 22,
    date: new Date(Date.now() - 1500000).toISOString(),
    duration: 2.1,
  },
  {
    id: 'pit-4',
    session_key: 9158,
    driver_number: 16,
    lap: 25,
    date: new Date(Date.now() - 1000000).toISOString(),
    duration: 2.4,
  },
  {
    id: 'pit-5',
    session_key: 9158,
    driver_number: 55,
    lap: 28,
    date: new Date(Date.now() - 500000).toISOString(),
    duration: 2.6,
  },
];

/**
 * Pre-built timeline entries for direct testing
 */
export const mockTimelineEntries: TimelineEntry[] = [
  {
    id: 'rc-5',
    lap: 35,
    timestamp: new Date(Date.now() - 600000).toISOString(),
    type: 'race_control',
    priority: 'critical',
    message: 'Session stopped',
    subMessage: 'Major incident',
    icon: 'stop',
    color: 'red',
  },
  {
    id: 'pit-5',
    lap: 28,
    timestamp: new Date(Date.now() - 500000).toISOString(),
    type: 'pit_stop',
    priority: 'medium',
    message: 'Lap 28 • Sainz pits',
    subMessage: '2.6s stop',
    driverName: 'Carlos Sainz',
    teamName: 'Ferrari',
    icon: 'pit-stop',
    color: 'orange',
  },
  {
    id: 'pit-4',
    lap: 25,
    timestamp: new Date(Date.now() - 1000000).toISOString(),
    type: 'pit_stop',
    priority: 'medium',
    message: 'Lap 25 • Leclerc pits',
    subMessage: '2.4s stop',
    driverName: 'Charles Leclerc',
    teamName: 'Ferrari',
    icon: 'pit-stop',
    color: 'orange',
  },
  {
    id: 'rc-4',
    lap: 20,
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    type: 'race_control',
    priority: 'high',
    message: 'Safety Car in this lap',
    icon: 'check',
    color: 'orange',
  },
  {
    id: 'pit-3',
    lap: 22,
    timestamp: new Date(Date.now() - 1500000).toISOString(),
    type: 'pit_stop',
    priority: 'medium',
    message: 'Lap 22 • Norris pits',
    subMessage: '2.1s stop',
    driverName: 'Lando Norris',
    teamName: 'McLaren',
    icon: 'pit-stop',
    color: 'orange',
  },
];

/**
 * Generate additional mock entries for stress testing
 */
export function generateMockEntries(count: number): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const priorities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
  const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
  const icons = ['safety-car', 'flag', 'stop', 'check', 'pit-stop', 'overtake', 'drs'];
  
  for (let i = 0; i < count; i++) {
    entries.push({
      id: `mock-${i}`,
      lap: Math.floor(Math.random() * 50) + 1,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      type: Math.random() > 0.5 ? 'race_control' : 'pit_stop',
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      message: `Mock event ${i}`,
      subMessage: 'Test data',
      driverName: mockDrivers[Math.floor(Math.random() * mockDrivers.length)]?.fullName,
      teamName: 'Test Team',
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  
  return entries;
}

/**
 * Test data for auto-scroll testing
 */
export const testAutoScrollData = {
  raceControl: mockRaceControl,
  pitStops: mockPitStops,
  drivers: mockDrivers,
  sessionStatus: 'live' as const,
};
