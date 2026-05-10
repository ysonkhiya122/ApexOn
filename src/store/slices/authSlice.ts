import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Check for existing session in localStorage
const loadAuthState = () => {
  try {
    const token = localStorage.getItem('apexon_token');
    const user = localStorage.getItem('apexon_user');
    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      };
    }
  } catch (e) {
    console.error('Failed to load auth state:', e);
  }
  return null;
};

const savedState = loadAuthState();
const initialState: AuthState = {
  user: savedState?.user || null,
  token: savedState?.token || null,
  isAuthenticated: savedState?.isAuthenticated || false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      // Persist to localStorage
      localStorage.setItem('apexon_token', action.payload.token);
      localStorage.setItem('apexon_user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      // Persist to localStorage
      localStorage.setItem('apexon_token', action.payload.token);
      localStorage.setItem('apexon_user', JSON.stringify(action.payload.user));
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('apexon_token');
      localStorage.removeItem('apexon_user');
    },
    clearError: (state) => {
      state.error = null;
    },
    // For restoring session on app load
    restoreSession: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
  restoreSession,
} = authSlice.actions;

export default authSlice.reducer;
