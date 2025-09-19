// Root Saga - Combines all feature sagas
import { all, fork } from '@redux-saga/core/effects';
import { subscriptionsSaga } from '../features/subscriptions/subscriptionsSaga';
import { dashboardSaga } from '../features/dashboard/dashboardSaga';
import { settingsSaga } from '../features/settings/settingsSaga';

export function* rootSaga() {
  yield all([
    fork(subscriptionsSaga),
    fork(dashboardSaga),
    fork(settingsSaga),
  ]);
}