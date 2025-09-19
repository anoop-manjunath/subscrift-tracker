// Settings Saga - Handle Settings Persistence and Side Effects
import { call, put, select, takeEvery } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  updateSettingsRequested,
  updateSettingsSuccess,
  updateSettingsFailure,
  loadSettingsRequested,
  loadSettingsSuccess,
} from './settingsSlice';
import { RootState } from '../../store/rootReducer';
import i18n from '../../i18n/i18n';

const SETTINGS_STORAGE_KEY = 'subscription-tracker-settings';

// Save settings to localStorage
function* saveSettingsToStorage(settings: any) {
  try {
    const settingsToSave = {
      timezone: settings.timezone,
      dateFormat: settings.dateFormat,
      currency: settings.currency,
      language: settings.language,
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

// Load settings from localStorage
function* loadSettingsFromStorage() {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return null;
  }
}

// Handle settings update
function* handleUpdateSettings(action: PayloadAction<Partial<any>>) {
  try {
    const currentSettings: any = yield select((state: RootState) => state.settings);
    const updatedSettings = { ...currentSettings, ...action.payload };
    
    // Update i18n language if changed
    if (action.payload.language && action.payload.language !== currentSettings.language) {
      yield call([i18n, i18n.changeLanguage], action.payload.language);
    }
    
    // Save to localStorage
    yield call(saveSettingsToStorage, updatedSettings);
    
    yield put(updateSettingsSuccess(action.payload));
  } catch (error) {
    yield put(updateSettingsFailure((error as Error).message));
  }
}

// Handle loading settings
function* handleLoadSettings() {
  try {
    const savedSettings: any = yield call(loadSettingsFromStorage);
    
    if (savedSettings) {
      // Update i18n language
      if (savedSettings.language) {
        yield call([i18n, i18n.changeLanguage], savedSettings.language);
      }
      
      yield put(loadSettingsSuccess(savedSettings));
    } else {
      // First time user - detect browser preferences
      const browserLanguage = navigator.language.split('-')[0];
      const supportedLanguage = ['en', 'hi'].includes(browserLanguage) ? browserLanguage : 'en';
      
      const detectedSettings = {
        language: supportedLanguage,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        currency: 'USD', // Could detect based on timezone/locale
        dateFormat: 'MM/DD/YYYY',
      };
      
      yield call([i18n, i18n.changeLanguage], detectedSettings.language);
      yield put(loadSettingsSuccess(detectedSettings));
      yield call(saveSettingsToStorage, detectedSettings);
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
    yield put(loadSettingsSuccess({})); // Load with defaults
  }
}

// Settings Saga
export function* settingsSaga() {
  yield takeEvery(updateSettingsRequested.type, handleUpdateSettings);
  yield takeEvery(loadSettingsRequested.type, handleLoadSettings);
}