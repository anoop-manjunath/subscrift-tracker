// Dashboard Saga - Analytics Side Effects
import { call, put, takeLatest, select } from '@redux-saga/core/effects';
import {
  fetchAnalyticsRequested,
  fetchAnalyticsSucceeded,
  fetchAnalyticsFailed,
} from './dashboardSlice';
import * as dashboardApi from '../../api/dashboardApi';
import { RootState } from '../../store';

function* fetchAnalyticsSaga() {
  try {
    const state: RootState = yield select();
    const { selectedTimeRange } = state.dashboard;
    
    const analytics = yield call(dashboardApi.fetchAnalytics, selectedTimeRange);
    yield put(fetchAnalyticsSucceeded(analytics));
  } catch (error: any) {
    yield put(fetchAnalyticsFailed(error.message || 'Failed to fetch analytics'));
  }
}

export function* dashboardSaga() {
  yield takeLatest(fetchAnalyticsRequested.type, fetchAnalyticsSaga);
}