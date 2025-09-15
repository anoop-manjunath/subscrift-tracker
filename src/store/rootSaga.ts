// Root Saga - Combines all feature sagas
import { all, fork } from '@redux-saga/core/effects';
import { subscriptionsSaga } from '../features/subscriptions/subscriptionsSaga';
import { dashboardSaga } from '../features/dashboard/dashboardSaga';

export function* rootSaga() {
  yield all([
    fork(subscriptionsSaga),
    fork(dashboardSaga),
  ]);
}