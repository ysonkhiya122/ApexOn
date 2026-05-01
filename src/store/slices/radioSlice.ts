import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RadioItem {
  recording_url: string;
  driver_number: string;
  date: string;
  session_key: string;
}

interface RadioState {
  currentRadio: RadioItem | null;
  isPlaying: boolean;
}

const initialState: RadioState = {
  currentRadio: null,
  isPlaying: false,
};

export const radioSlice = createSlice({
  name: 'radio',
  initialState,
  reducers: {
    setCurrentRadio: (state, action: PayloadAction<RadioItem | null>) => {
      state.currentRadio = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
  },
});

export const { setCurrentRadio, setIsPlaying } = radioSlice.actions;
export default radioSlice.reducer;
