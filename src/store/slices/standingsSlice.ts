import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CURRENT_SEASON } from '../../utils/season';

interface StandingsUIState {
  selectedSeason: string;
  standingsType: 'drivers' | 'constructors';
}

const initialState: StandingsUIState = {
  selectedSeason: CURRENT_SEASON,
  standingsType: 'drivers',
};

export const standingsSlice = createSlice({
  name: 'standings',
  initialState,
  reducers: {
    setSelectedSeason: (state, action: PayloadAction<string>) => {
      state.selectedSeason = action.payload;
    },
    setStandingsType: (state, action: PayloadAction<'drivers' | 'constructors'>) => {
      state.standingsType = action.payload;
    },
  },
});

export const { setSelectedSeason, setStandingsType } = standingsSlice.actions;

export default standingsSlice.reducer;
