// Root Reducer - Combines all feature slices
import { combineReducers } from '@reduxjs/toolkit';
import subscriptionsReducer from '../features/subscriptions/subscriptionsSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import settingsReducer from '../features/settings/settingsSlice';

export const rootReducer = combineReducers({
  subscriptions: subscriptionsReducer,
  dashboard: dashboardReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;