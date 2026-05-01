import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  preloaderVisible: boolean;
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
}

const initialState: UiState = {
  preloaderVisible: true,
  sidebarOpen: false,
  theme: 'dark',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPreloaderVisible: (state, action: PayloadAction<boolean>) => {
      state.preloaderVisible = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
    },
  },
});

export const { setPreloaderVisible, toggleSidebar, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
