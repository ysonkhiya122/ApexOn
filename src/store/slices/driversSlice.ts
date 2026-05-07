import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DriversUIState {
  searchQuery: string;
  selectedNationality: string;
  selectedTeam: string;
  currentPage: number;
  itemsPerPage: number;
  sortBy: 'name' | 'championships' | 'points';
  sortOrder: 'asc' | 'desc';
}

const initialState: DriversUIState = {
  searchQuery: '',
  selectedNationality: '',
  selectedTeam: '',
  currentPage: 1,
  itemsPerPage: 20,
  sortBy: 'name',
  sortOrder: 'asc',
};

export const driversSlice = createSlice({
  name: 'drivers',
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
    setTeamFilter: (state, action: PayloadAction<string>) => {
      state.selectedTeam = action.payload;
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
      state.selectedTeam = '';
      state.currentPage = 1;
      state.sortBy = 'name';
      state.sortOrder = 'asc';
    },
  },
});

export const {
  setSearchQuery,
  setNationalityFilter,
  setTeamFilter,
  setCurrentPage,
  setSortBy,
  setSortOrder,
  resetFilters,
} = driversSlice.actions;

export default driversSlice.reducer;
