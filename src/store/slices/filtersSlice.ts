import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  selectedYear: string;
  selectedRound: string;
  selectedDriver: string;
  selectedCircuit: string;
}

const initialState: FiltersState = {
  selectedYear: '2026',
  selectedRound: '1',
  selectedDriver: '',
  selectedCircuit: '',
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSelectedYear: (state, action: PayloadAction<string>) => {
      state.selectedYear = action.payload;
    },
    setSelectedRound: (state, action: PayloadAction<string>) => {
      state.selectedRound = action.payload;
    },
    setSelectedDriver: (state, action: PayloadAction<string>) => {
      state.selectedDriver = action.payload;
    },
    setSelectedCircuit: (state, action: PayloadAction<string>) => {
      state.selectedCircuit = action.payload;
    },
  },
});

export const { setSelectedYear, setSelectedRound, setSelectedDriver, setSelectedCircuit } = filtersSlice.actions;
export default filtersSlice.reducer;
