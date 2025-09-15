// Subscriptions Redux Slice - Interview-Grade State Management
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subscription, SubscriptionFilters, CreateSubscriptionRequest, UpdateSubscriptionRequest } from '../../types/subscription';

// State interface
interface SubscriptionsState {
  items: Subscription[];
  loading: boolean;
  error: string | null;
  filters: SubscriptionFilters;
  selectedId: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

// Initial state
const initialState: SubscriptionsState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    categories: [],
    statuses: [],
    currencies: [],
    priceRange: { min: 0, max: 10000 },
    sortBy: 'name',
    sortOrder: 'asc',
  },
  selectedId: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 20,
};

// Slice definition
const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    // Fetch actions
    fetchSubscriptionsRequested: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSubscriptionsSucceeded: (state, action: PayloadAction<{ 
      subscriptions: Subscription[];
      total: number;
      page: number;
    }>) => {
      state.loading = false;
      state.items = action.payload.subscriptions;
      state.totalCount = action.payload.total;
      state.currentPage = action.payload.page;
    },
    fetchSubscriptionsFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CRUD actions
    createSubscriptionRequested: (state, _action: PayloadAction<CreateSubscriptionRequest>) => {
      state.loading = true;
      state.error = null;
    },
    createSubscriptionSucceeded: (state, action: PayloadAction<Subscription>) => {
      state.loading = false;
      state.items.unshift(action.payload);
      state.totalCount += 1;
    },
    createSubscriptionFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateSubscriptionRequested: (state, _action: PayloadAction<UpdateSubscriptionRequest>) => {
      state.loading = true;
      state.error = null;
    },
    updateSubscriptionSucceeded: (state, action: PayloadAction<Subscription>) => {
      state.loading = false;
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    updateSubscriptionFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteSubscriptionRequested: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteSubscriptionSucceeded: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalCount -= 1;
    },
    deleteSubscriptionFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // UI state actions
    setFilters: (state, action: PayloadAction<Partial<SubscriptionFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedSubscription: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const {
  fetchSubscriptionsRequested,
  fetchSubscriptionsSucceeded,
  fetchSubscriptionsFailed,
  createSubscriptionRequested,
  createSubscriptionSucceeded,
  createSubscriptionFailed,
  updateSubscriptionRequested,
  updateSubscriptionSucceeded,
  updateSubscriptionFailed,
  deleteSubscriptionRequested,
  deleteSubscriptionSucceeded,
  deleteSubscriptionFailed,
  setFilters,
  clearFilters,
  setSelectedSubscription,
  setCurrentPage,
  clearError,
} = subscriptionsSlice.actions;

// Export reducer
export default subscriptionsSlice.reducer;