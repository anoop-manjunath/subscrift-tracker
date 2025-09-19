// Custom Hook for Settings Integration
import { useAppSelector } from '../store/hooks';
import { formatCurrency, formatDate, getLocaleFromLanguage } from '../utils/formatters';

export const useSettings = () => {
  const settings = useAppSelector(state => state.settings);
  
  // Format currency with current settings
  const formatPrice = (amount: number) => {
    const locale = getLocaleFromLanguage(settings.language);
    return formatCurrency(amount, settings.currency, locale);
  };
  
  // Format date with current settings
  const formatDateWithSettings = (date: string | Date) => {
    return formatDate(date, settings.dateFormat, settings.timezone);
  };
  
  return {
    settings,
    formatPrice,
    formatDate: formatDateWithSettings,
    timezone: settings.timezone,
    currency: settings.currency,
    dateFormat: settings.dateFormat,
    language: settings.language,
  };
};