import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import filtersReducer from './slices/filtersSlice';
import chatReducer from './slices/chatSlice';
import radioReducer from './slices/radioSlice';
import fanProfileReducer from './slices/fanProfileSlice';
import languageReducer from './slices/languageSlice';
import driversReducer from './slices/driversSlice';
import teamsReducer from './slices/teamsSlice';
import circuitsReducer from './slices/circuitsSlice';
import standingsReducer from './slices/standingsSlice';
import { jolpicaService } from './services/jolpicaService';
import { openF1Service } from './services/openF1Service';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    filters: filtersReducer,
    chat: chatReducer,
    radio: radioReducer,
    fanProfile: fanProfileReducer,
    language: languageReducer,
    drivers: driversReducer,
    teams: teamsReducer,
    circuits: circuitsReducer,
    standings: standingsReducer,
    [jolpicaService.reducerPath]: jolpicaService.reducer,
    [openF1Service.reducerPath]: openF1Service.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jolpicaService.middleware, openF1Service.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
