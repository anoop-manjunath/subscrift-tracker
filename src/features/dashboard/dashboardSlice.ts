// Dashboard Redux Slice - Analytics and Overview
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpendingAnalytics, BudgetAlert } from '../../types/subscription';

interface DashboardState {
  analytics: SpendingAnalytics | null;
  budgetAlerts: BudgetAlert[];
  loading: boolean;
  error: string | null;
  selectedTimeRange: 'week' | 'month' | 'quarter' | 'year';
}

const initialState: DashboardState = {
  analytics: null,
  budgetAlerts: [],
  loading: false,
  error: null,
  selectedTimeRange: 'month',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchAnalyticsRequested: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAnalyticsSucceeded: (state, action: PayloadAction<SpendingAnalytics>) => {
      state.loading = false;
      state.analytics = action.payload;
    },
    fetchAnalyticsFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setTimeRange: (state, action: PayloadAction<'week' | 'month' | 'quarter' | 'year'>) => {
      state.selectedTimeRange = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchAnalyticsRequested,
  fetchAnalyticsSucceeded,
  fetchAnalyticsFailed,
  setTimeRange,
  clearError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;