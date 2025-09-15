// Subscriptions Saga - Side Effects Management
import { call, put, takeLatest, select } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
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
} from './subscriptionsSlice';
import { SubscriptionResponse, CreateSubscriptionRequest, UpdateSubscriptionRequest } from '../../types/subscription';
import * as subscriptionsApi from '../../api/subscriptionsApi';
import { RootState } from '../../store';

// Fetch subscriptions saga
function* fetchSubscriptionsSaga() {
  try {
    const state: RootState = yield select();
    const { filters, currentPage, pageSize } = state.subscriptions;
    
    const response: SubscriptionResponse = yield call(
      subscriptionsApi.fetchSubscriptions,
      { filters, page: currentPage, limit: pageSize }
    );
    
    yield put(fetchSubscriptionsSucceeded({
      subscriptions: response.data,
      total: response.total,
      page: response.page,
    }));
  } catch (error: any) {
    yield put(fetchSubscriptionsFailed(error.message || 'Failed to fetch subscriptions'));
  }
}

// Create subscription saga
function* createSubscriptionSaga(action: PayloadAction<CreateSubscriptionRequest>) {
  try {
    const newSubscription = yield call(subscriptionsApi.createSubscription, action.payload);
    yield put(createSubscriptionSucceeded(newSubscription));
    
    // Optionally refresh the list
    yield put(fetchSubscriptionsRequested());
  } catch (error: any) {
    yield put(createSubscriptionFailed(error.message || 'Failed to create subscription'));
  }
}

// Update subscription saga
function* updateSubscriptionSaga(action: PayloadAction<UpdateSubscriptionRequest>) {
  try {
    const updatedSubscription = yield call(subscriptionsApi.updateSubscription, action.payload);
    yield put(updateSubscriptionSucceeded(updatedSubscription));
  } catch (error: any) {
    yield put(updateSubscriptionFailed(error.message || 'Failed to update subscription'));
  }
}

// Delete subscription saga
function* deleteSubscriptionSaga(action: PayloadAction<string>) {
  try {
    yield call(subscriptionsApi.deleteSubscription, action.payload);
    yield put(deleteSubscriptionSucceeded(action.payload));
  } catch (error: any) {
    yield put(deleteSubscriptionFailed(error.message || 'Failed to delete subscription'));
  }
}

// Root subscriptions saga
export function* subscriptionsSaga() {
  yield takeLatest(fetchSubscriptionsRequested.type, fetchSubscriptionsSaga);
  yield takeLatest(createSubscriptionRequested.type, createSubscriptionSaga);
  yield takeLatest(updateSubscriptionRequested.type, updateSubscriptionSaga);
  yield takeLatest(deleteSubscriptionRequested.type, deleteSubscriptionSaga);
}