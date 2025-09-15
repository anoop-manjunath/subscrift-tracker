// Subscription Tracker Types - Interview-Grade TypeScript

export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'custom';

export type SubscriptionCategory = 
  | 'streaming' 
  | 'productivity' 
  | 'cloud' 
  | 'development' 
  | 'design' 
  | 'marketing'
  | 'finance' 
  | 'other';

export type SubscriptionStatus = 'active' | 'paused' | 'canceled' | 'trial';

export type PaymentMethod = 'credit_card' | 'debit_card' | 'upi' | 'netbanking' | 'wallet' | 'paypal';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  category: SubscriptionCategory;
  price: number; // in minor currency units (cents/paise)
  currency: Currency;
  billingCycle: BillingCycle;
  customCycleDays?: number; // for custom billing cycles
  nextBillingDate: string; // ISO date string
  lastBillingDate?: string; // ISO date string
  status: SubscriptionStatus;
  paymentMethod: PaymentMethod;
  tags: string[];
  trialEndsOn?: string; // ISO date string
  reminderDaysBefore: number; // days before renewal to remind
  logoUrl?: string;
  websiteUrl?: string;
  notes?: string; // user notes about the subscription
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  
  // Calculated fields (computed in selectors)
  monthlyEquivalent?: number; // normalized to monthly cost
  annualCost?: number; // total annual cost
  daysUntilRenewal?: number; // days until next billing
}

export interface SubscriptionFilters {
  search: string;
  categories: SubscriptionCategory[];
  statuses: SubscriptionStatus[];
  currencies: Currency[];
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: 'name' | 'price' | 'nextBilling' | 'created' | 'updated';
  sortOrder: 'asc' | 'desc';
}

export interface BudgetAlert {
  id: string;
  name: string;
  monthlyLimit: number;
  currency: Currency;
  categories: SubscriptionCategory[];
  isEnabled: boolean;
  notificationThreshold: number; // percentage (e.g., 80 for 80%)
}

export interface SpendingAnalytics {
  totalMonthlySpend: number;
  totalAnnualSpend: number;
  categoryBreakdown: Record<SubscriptionCategory, number>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
  upcomingPayments: Array<{
    date: string;
    subscriptions: Subscription[];
    totalAmount: number;
  }>;
}

// API Response Types
export interface SubscriptionResponse {
  data: Subscription[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateSubscriptionRequest {
  name: string;
  description?: string;
  category: SubscriptionCategory;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  customCycleDays?: number;
  nextBillingDate: string;
  status: SubscriptionStatus;
  paymentMethod: PaymentMethod;
  tags: string[];
  trialEndsOn?: string;
  reminderDaysBefore: number;
  logoUrl?: string;
  websiteUrl?: string;
  notes?: string;
}

export interface UpdateSubscriptionRequest extends Partial<CreateSubscriptionRequest> {
  id: string;
}