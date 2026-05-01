import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FanProfileState {
  points: number;
  level: string;
  completedQuizzes: string[];
  favoriteDriver: string;
  favoriteTeam: string;
}

const initialState: FanProfileState = {
  points: 0,
  level: 'Rookie',
  completedQuizzes: [],
  favoriteDriver: '',
  favoriteTeam: '',
};

export const fanProfileSlice = createSlice({
  name: 'fanProfile',
  initialState,
  reducers: {
    addPoints: (state, action: PayloadAction<number>) => {
      state.points += action.payload;
      if (state.points >= 500) state.level = 'World Champion';
      else if (state.points >= 300) state.level = 'Pole Sitter';
      else if (state.points >= 150) state.level = 'Pro Driver';
      else if (state.points >= 50) state.level = 'Karting Enthusiast';
    },
    markQuizCompleted: (state, action: PayloadAction<string>) => {
      if (!state.completedQuizzes.includes(action.payload)) {
        state.completedQuizzes.push(action.payload);
      }
    },
    updateFavorites: (state, action: PayloadAction<{ driver?: string; team?: string }>) => {
      if (action.payload.driver !== undefined) state.favoriteDriver = action.payload.driver;
      if (action.payload.team !== undefined) state.favoriteTeam = action.payload.team;
    },
  },
});

export const { addPoints, markQuizCompleted, updateFavorites } = fanProfileSlice.actions;
export default fanProfileSlice.reducer;
