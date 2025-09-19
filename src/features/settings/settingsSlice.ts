// Settings Redux Slice - User Preferences Management
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  dateFormat: 'MM/DD/YYYY',
  currency: 'USD',
  language: 'en',
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Settings actions
    updateSettingsRequested: (state, action: PayloadAction<Partial<SettingsState>>) => {
      state.loading = true;
      state.error = null;
    },
    updateSettingsSuccess: (state, action: PayloadAction<Partial<SettingsState>>) => {
      Object.assign(state, action.payload);
      state.loading = false;
      state.error = null;
    },
    updateSettingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Load settings from localStorage
    loadSettingsRequested: (state) => {
      state.loading = true;
    },
    loadSettingsSuccess: (state, action: PayloadAction<Partial<SettingsState>>) => {
      Object.assign(state, action.payload);
      state.loading = false;
    },
    
    // Reset settings
    resetSettings: (state) => {
      return { ...initialState, loading: false };
    },
    
    // Individual setting updates for immediate UI feedback
    setTimezone: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload;
    },
    setDateFormat: (state, action: PayloadAction<string>) => {
      state.dateFormat = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const {
  updateSettingsRequested,
  updateSettingsSuccess,
  updateSettingsFailure,
  loadSettingsRequested,
  loadSettingsSuccess,
  resetSettings,
  setTimezone,
  setDateFormat,
  setCurrency,
  setLanguage,
} = settingsSlice.actions;

export default settingsSlice.reducer;