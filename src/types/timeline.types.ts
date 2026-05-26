/**
 * Timeline Types
 * 
 * Core types for race timeline events.
 * Used throughout the timeline system for type safety.
 */

export type TimelinePriority = 'low' | 'medium' | 'high' | 'critical';

export type TimelineEventType = 
  | 'race_control'
  | 'pit_stop'
  | 'overtake'
  | 'fastest_lap';

export interface TimelineEntry {
  id: string;          // Unique ID for deduplication
  lap: number;
  timestamp: string;
  type: TimelineEventType;
  priority: TimelinePriority;
  message: string;     // Human-readable narrative (SHORT, scannable)
  subMessage?: string; // Additional context (optional)
  driverName?: string;
  teamName?: string;
  icon: string;
  color: string;       // For visual hierarchy
}

/**
 * Timeline State
 * 
 * Tracks last processed IDs for incremental updates.
 * Prevents duplicate events and unnecessary re-processing.
 */
export interface TimelineState {
  lastProcessedRaceControlId: string | null;
  lastProcessedPitId: string | null;
  entries: TimelineEntry[];
}

/**
 * Race Control Message (from OpenF1 API)
 */
export interface RaceControlMessage {
  id: string;
  session_key: number;
  lap: number;
  date: string;
  category: string;
  message?: string;
}

/**
 * Pit Stop (from OpenF1 API)
 */
export interface PitStop {
  id: string;
  session_key: number;
  driver_number: number;
  lap: number;
  date: string;
  duration: number;
}

/**
 * Driver (normalized)
 */
export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  number: number;
  team?: string;
}

/**
 * Race State (simplified for timeline)
 */
export interface RaceState {
  drivers: Driver[];
  sessionStatus: 'scheduled' | 'live' | 'completed' | 'aborted';
}
