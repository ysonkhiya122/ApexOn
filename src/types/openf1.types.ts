/**
 * OpenF1 API types used by RTK Query services.
 *
 * These mirror the public OpenF1 payloads for fields currently consumed by
 * APexOn. OpenF1 may add fields over time, so these models intentionally keep
 * only the stable fields the UI reads.
 */

export type OpenF1QueryValue = string | number | boolean | undefined;
export type OpenF1QueryParams = Record<string, OpenF1QueryValue>;

export interface OpenF1Meeting {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name?: string;
  location?: string;
  country_key?: number;
  country_code?: string;
  country_name?: string;
  circuit_key?: number;
  circuit_short_name?: string;
  date_start?: string;
  gmt_offset?: string;
  year?: number;
}

export interface OpenF1Session {
  session_key: number;
  meeting_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end?: string;
  gmt_offset: string;
  country_key?: number;
  country_code?: string;
  country_name?: string;
  circuit_key?: number;
  circuit_short_name?: string;
  location?: string;
  year?: number;
}

export interface OpenF1Driver {
  session_key?: number;
  meeting_key?: number;
  driver_number: number;
  broadcast_name?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  name_acronym?: string;
  team_name?: string;
  team_colour?: string;
  country_code?: string;
  headshot_url?: string;
}

export interface OpenF1Weather {
  session_key: number;
  date: string;
  air_temperature?: number;
  humidity?: number;
  pressure?: number;
  rainfall?: number;
  track_temperature?: number;
  wind_direction?: number;
  wind_speed?: number;
}

export interface OpenF1TeamRadio {
  session_key: number;
  driver_number: number;
  date: string;
  recording_url: string;
}

export interface OpenF1Stint {
  session_key: number;
  driver_number: number;
  stint_number?: number;
  lap_start?: number;
  lap_end?: number;
  compound?: string;
  tyre_age_at_start?: number;
}

export interface OpenF1RaceControlMessage {
  session_key: number;
  date: string;
  category?: string;
  flag?: string;
  scope?: string;
  sector?: number;
  driver_number?: number;
  lap_number?: number;
  message?: string;
}

export interface OpenF1PitStop {
  session_key: number;
  date: string;
  driver_number: number;
  lap_number?: number;
  pit_duration?: number;
}

export interface OpenF1Position {
  session_key: number;
  date?: string;
  timestamp?: string;
  driver_number: number;
  position: number;
}

export interface OpenF1Interval {
  session_key: number;
  date: string;
  driver_number: number;
  gap_to_leader?: number | string | null;
  interval?: number | string | null;
}

export interface OpenF1Lap {
  session_key: number;
  driver_number: number;
  lap_number: number;
  date_start?: string;
  lap_duration?: number;
  duration_sector_1?: number;
  duration_sector_2?: number;
  duration_sector_3?: number;
  is_pit_out_lap?: boolean;
  segments_sector_1?: number[];
  segments_sector_2?: number[];
  segments_sector_3?: number[];
}
