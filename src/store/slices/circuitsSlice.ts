import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CircuitsUIState {
  searchQuery: string;
  selectedCountry: string;
  currentPage: number;
  itemsPerPage: number;
  sortBy: 'name' | 'country';
  sortOrder: 'asc' | 'desc';
}

const initialState: CircuitsUIState = {
  searchQuery: '',
  selectedCountry: '',
  currentPage: 1,
  itemsPerPage: 16,
  sortBy: 'name',
  sortOrder: 'asc',
};

export const circuitsSlice = createSlice({
  name: 'circuits',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCountryFilter: (state, action: PayloadAction<string>) => {
      state.selectedCountry = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'country'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCountry = '';
      state.currentPage = 1;
      state.sortBy = 'name';
      state.sortOrder = 'asc';
    },
  },
});

export const {
  setSearchQuery,
  setCountryFilter,
  setCurrentPage,
  setSortBy,
  setSortOrder,
  resetFilters,
} = circuitsSlice.actions;

export default circuitsSlice.reducer;
