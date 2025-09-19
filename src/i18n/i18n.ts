// Internationalization Configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  hi: {
    translation: hiTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Debug mode
    debug: process.env.NODE_ENV === 'development',
    
    // React specific options
    react: {
      useSuspense: false, // Disable suspense for better error handling
    },
  });

export default i18n;