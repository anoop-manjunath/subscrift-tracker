// Subscription Tracker Dashboard - Professional Design
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSubscriptionsRequested } from '../features/subscriptions/subscriptionsSlice';
import { fetchAnalyticsRequested } from '../features/dashboard/dashboardSlice';
import { loadSettingsRequested } from '../features/settings/settingsSlice';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StatsCards } from '../components/dashboard/StatsCards';
import { UpcomingPayments } from '../components/dashboard/UpcomingPayments';
import { SubscriptionsList } from '../components/subscriptions/SubscriptionsList';
import { SpendingChart } from '../components/dashboard/SpendingChart';

const Index = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading: subscriptionsLoading, items: subscriptions } = useAppSelector(state => state.subscriptions);
  const { loading: analyticsLoading, analytics } = useAppSelector(state => state.dashboard);
  const { loading: settingsLoading } = useAppSelector(state => state.settings);

  useEffect(() => {
    // Load settings first, then other data
    dispatch(loadSettingsRequested());
    dispatch(fetchSubscriptionsRequested());
    dispatch(fetchAnalyticsRequested());
  }, [dispatch]);

  // Refetch when filters change
  const filters = useAppSelector(state => state.subscriptions.filters);
  useEffect(() => {
    dispatch(fetchSubscriptionsRequested());
  }, [dispatch, filters]);

  const isLoading = subscriptionsLoading || analyticsLoading || settingsLoading;

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <DashboardHeader />
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          <StatsCards analytics={analytics} loading={isLoading} />
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Spending Chart */}
          <div className="lg:col-span-2">
            <SpendingChart 
              data={analytics?.monthlyTrend || []} 
              loading={isLoading}
            />
          </div>

          {/* Right Column - Upcoming Payments */}
          <div>
            <UpcomingPayments 
              payments={analytics?.upcomingPayments || []} 
              loading={isLoading}
            />
          </div>
        </div>

        {/* Subscriptions List */}
        <section className="mt-8">
          <SubscriptionsList 
            subscriptions={subscriptions}
            loading={isLoading}
          />
        </section>
      </main>
    </div>
  );
};

export default Index;