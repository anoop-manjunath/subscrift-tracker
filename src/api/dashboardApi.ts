// Dashboard API - Analytics and Overview Data
import { SpendingAnalytics } from '../types/subscription';
import { mockSubscriptions } from '../data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate spending analytics
export const fetchAnalytics = async (timeRange: 'week' | 'month' | 'quarter' | 'year'): Promise<SpendingAnalytics> => {
  await delay(400);

  // Calculate monthly equivalent for all subscriptions
  const monthlySpends = mockSubscriptions
    .filter(sub => sub.status === 'active')
    .map(sub => {
      switch (sub.billingCycle) {
        case 'monthly':
          return sub.price / 100; // Convert from minor units
        case 'yearly':
          return sub.price / 100 / 12;
        case 'weekly':
          return sub.price / 100 * 4.33; // ~4.33 weeks per month
        case 'custom':
          return sub.customCycleDays ? (sub.price / 100) * (30 / sub.customCycleDays) : 0;
        default:
          return 0;
      }
    });

  const totalMonthlySpend = monthlySpends.reduce((sum, amount) => sum + amount, 0);
  const totalAnnualSpend = totalMonthlySpend * 12;

  // Category breakdown
  const categoryBreakdown = mockSubscriptions
    .filter(sub => sub.status === 'active')
    .reduce((acc, sub) => {
      const monthlyAmount = monthlySpends[mockSubscriptions.indexOf(sub)] || 0;
      acc[sub.category] = (acc[sub.category] || 0) + monthlyAmount;
      return acc;
    }, {} as Record<string, number>);

  // Generate mock monthly trend data
  const monthlyTrend = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      amount: totalMonthlySpend * (0.8 + Math.random() * 0.4), // Add some variation
    };
  });

  // Calculate upcoming payments (next 30 days)
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const upcomingPayments = mockSubscriptions
    .filter(sub => {
      const nextBilling = new Date(sub.nextBillingDate);
      return nextBilling >= today && nextBilling <= thirtyDaysFromNow && sub.status === 'active';
    })
    .reduce((acc, sub) => {
      const date = sub.nextBillingDate.split('T')[0]; // Get date part only
      const existingEntry = acc.find(entry => entry.date === date);
      
      if (existingEntry) {
        existingEntry.subscriptions.push(sub);
        existingEntry.totalAmount += sub.price / 100;
      } else {
        acc.push({
          date,
          subscriptions: [sub],
          totalAmount: sub.price / 100,
        });
      }
      
      return acc;
    }, [] as SpendingAnalytics['upcomingPayments'])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    totalMonthlySpend,
    totalAnnualSpend,
    categoryBreakdown: categoryBreakdown as any,
    monthlyTrend,
    upcomingPayments,
  };
};