// Formatting Utilities - Timezone, Currency, Date Formatting
import { format, parseISO, isValid } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

// Currency formatting with proper symbols and positioning
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback for unsupported currencies
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      JPY: '¥',
      CAD: 'CAD',
      AUD: 'AUD',
    };
    
    const symbol = symbols[currency] || currency;
    return `${symbol}${amount.toFixed(2)}`;
  }
};

// Date formatting with timezone support
export const formatDate = (
  date: string | Date,
  dateFormat: string = 'MM/DD/YYYY',
  timezone: string = 'UTC'
): string => {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else {
      dateObj = date;
    }
    
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }

    // Convert to specified timezone
    const zonedDate = toZonedTime(dateObj, timezone);
    
    // Format according to specified format
    let formatPattern: string;
    switch (dateFormat) {
      case 'MM/DD/YYYY':
        formatPattern = 'MM/dd/yyyy';
        break;
      case 'DD/MM/YYYY':
        formatPattern = 'dd/MM/yyyy';
        break;
      case 'YYYY-MM-DD':
        formatPattern = 'yyyy-MM-dd';
        break;
      case 'DD MMM YYYY':
        formatPattern = 'dd MMM yyyy';
        break;
      default:
        formatPattern = 'MM/dd/yyyy';
    }
    
    return format(zonedDate, formatPattern);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

// Format date with timezone using date-fns-tz
export const formatDateInTimezone = (
  date: string | Date,
  formatStr: string,
  timezone: string = 'UTC'
): string => {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else {
      dateObj = date;
    }
    
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }

    return formatInTimeZone(dateObj, timezone, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

// Get relative time (e.g., "in 5 days", "3 days ago")
export const getRelativeTime = (
  date: string | Date,
  timezone: string = 'UTC',
  locale: string = 'en'
): string => {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else {
      dateObj = date;
    }
    
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }

    const now = new Date();
    const zonedDate = toZonedTime(dateObj, timezone);
    const zonedNow = toZonedTime(now, timezone);
    
    const diffInMs = zonedDate.getTime() - zonedNow.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Tomorrow';
    } else if (diffInDays === -1) {
      return 'Yesterday';
    } else if (diffInDays > 0) {
      return `In ${diffInDays} days`;
    } else {
      return `${Math.abs(diffInDays)} days ago`;
    }
  } catch (error) {
    console.error('Relative time error:', error);
    return 'Unknown';
  }
};

// Get locale from language code for number/currency formatting
export const getLocaleFromLanguage = (language: string): string => {
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'hi': 'hi-IN',
  };
  
  return localeMap[language] || 'en-US';
};

// Format number with locale-specific thousands separators
export const formatNumber = (
  number: number,
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale).format(number);
  } catch (error) {
    return number.toString();
  }
};