/**
 * Leaderboard Slice
 * 
 * Manages live leaderboard state including:
 * - Driver positions
 * - Position changes
 * - Gaps/intervals
 * - Tire information
 * - Pit status
 * 
 * Uses incremental updates to detect position changes.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeaderboardEntry, LeaderboardState } from '../../types/leaderboard.types';

const initialState: LeaderboardState = {
  entries: [],
  isLoading: false,
  hasError: false,
  errorMessage: null,
  lastUpdate: 0,
  sessionStatus: 'scheduled',
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    /**
     * Update leaderboard entries.
     * Preserves previousPosition for change detection.
     */
    updateLeaderboard: (state, action: PayloadAction<LeaderboardEntry[]>) => {
      const newEntries = action.payload.map((entry, idx) => {
        // Find previous entry for this driver
        const previous = state.entries.find(e => e.driver.id === entry.driver.id);
        
        return {
          ...entry,
          previousPosition: previous?.position || idx + 1,
        };
      });
      
      state.entries = newEntries;
      state.lastUpdate = Date.now();
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
     * Update session status.
     */
    updateSessionStatus: (state, action: PayloadAction<'scheduled' | 'live' | 'completed' | 'aborted'>) => {
      state.sessionStatus = action.payload;
    },
    
    /**
     * Clear leaderboard (for new session).
     */
    clearLeaderboard: (state) => {
      state.entries = [];
      state.lastUpdate = 0;
    },
  },
});

export const {
  updateLeaderboard,
  setLoading,
  setError,
  updateSessionStatus,
  clearLeaderboard,
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
