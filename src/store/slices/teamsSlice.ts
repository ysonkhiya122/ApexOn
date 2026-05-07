import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TeamsUIState {
  searchQuery: string;
  selectedNationality: string;
  currentPage: number;
  itemsPerPage: number;
  sortBy: 'name' | 'championships' | 'points';
  sortOrder: 'asc' | 'desc';
}

const initialState: TeamsUIState = {
  searchQuery: '',
  selectedNationality: '',
  currentPage: 1,
  itemsPerPage: 12,
  sortBy: 'name',
  sortOrder: 'asc',
};

export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setNationalityFilter: (state, action: PayloadAction<string>) => {
      state.selectedNationality = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'championships' | 'points'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedNationality = '';
      state.currentPage = 1;
      state.sortBy = 'name';
      state.sortOrder = 'asc';
    },
  },
});

export const {
  setSearchQuery,
  setNationalityFilter,
  setCurrentPage,
  setSortBy,
  setSortOrder,
  resetFilters,
} = teamsSlice.actions;

export default teamsSlice.reducer;
