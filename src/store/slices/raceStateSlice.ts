/**
 * Race State Slice
 * 
 * Manages live race state including:
 * - Timeline entries (incremental updates)
 * - Race control messages
 * - Pit stops
 * - Session status
 * 
 * Uses incremental updates to prevent unnecessary re-processing.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimelineState, RaceControlMessage, PitStop, Driver } from '../../types/timeline.types';
import { addTimelineEntries } from '../../utils/timeline/buildTimelineEntries';

interface RaceState {
  timeline: TimelineState;
  raceControl: RaceControlMessage[];
  pitStops: PitStop[];
  drivers: Driver[];
  sessionStatus: 'scheduled' | 'live' | 'completed' | 'aborted';
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

const initialState: RaceState = {
  timeline: {
    lastProcessedRaceControlId: null,
    lastProcessedPitId: null,
    entries: [],
  },
  raceControl: [],
  pitStops: [],
  drivers: [],
  sessionStatus: 'scheduled',
  isLoading: false,
  hasError: false,
  errorMessage: null,
};

const raceStateSlice = createSlice({
  name: 'raceState',
  initialState,
  reducers: {
    /**
     * Update race control messages (INCREMENTAL).
     * Automatically rebuilds timeline with new entries only.
     */
    updateRaceControl: (state, action: PayloadAction<RaceControlMessage[]>) => {
      state.raceControl = action.payload;
      
      // INCREMENTAL update (NOT rebuild everything)
      state.timeline = addTimelineEntries(
        state.timeline,
        action.payload,
        state.pitStops,
        { drivers: state.drivers, sessionStatus: state.sessionStatus }
      );
    },
    
    /**
     * Update pit stops (INCREMENTAL).
     * Automatically rebuilds timeline with new entries only.
     */
    updatePitStops: (state, action: PayloadAction<PitStop[]>) => {
      state.pitStops = action.payload;
      
      // INCREMENTAL update (NOT rebuild everything)
      state.timeline = addTimelineEntries(
        state.timeline,
        state.raceControl,
        action.payload,
        { drivers: state.drivers, sessionStatus: state.sessionStatus }
      );
    },
    
    /**
     * Update drivers list.
     */
    updateDrivers: (state, action: PayloadAction<Driver[]>) => {
      state.drivers = action.payload;
    },
    
    /**
     * Update session status.
     */
    updateSessionStatus: (state, action: PayloadAction<'scheduled' | 'live' | 'completed' | 'aborted'>) => {
      state.sessionStatus = action.payload;
    },
    
    /**
     * Set loading state.
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    /**
     * Set error state.
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.hasError = !!action.payload;
      state.errorMessage = action.payload;
      state.isLoading = false;
    },
    
    /**
     * Clear timeline (for new session).
     */
    clearTimeline: (state) => {
      state.timeline = {
        lastProcessedRaceControlId: null,
        lastProcessedPitId: null,
        entries: [],
      };
    },
  },
});

export const {
  updateRaceControl,
  updatePitStops,
  updateDrivers,
  updateSessionStatus,
  setLoading,
  setError,
  clearTimeline,
} = raceStateSlice.actions;

export default raceStateSlice.reducer;
