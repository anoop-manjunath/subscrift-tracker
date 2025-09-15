// Stats Cards - Financial Overview Components
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, DollarSign, Calendar, CreditCard } from 'lucide-react';
import { SpendingAnalytics } from '../../types/subscription';

interface StatsCardsProps {
  analytics: SpendingAnalytics | null;
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ analytics, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card border-card-border">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const monthlySpend = analytics?.totalMonthlySpend || 0;
  const annualSpend = analytics?.totalAnnualSpend || 0;
  const upcomingCount = analytics?.upcomingPayments?.length || 0;
  
  // Calculate trend (mock data for now)
  const monthlyTrend = 5.2; // percentage increase
  const isPositiveTrend = monthlyTrend > 0;

  const stats = [
    {
      title: 'Monthly Spending',
      value: `$${monthlySpend.toFixed(2)}`,
      icon: DollarSign,
      trend: `${isPositiveTrend ? '+' : ''}${monthlyTrend.toFixed(1)}%`,
      trendIcon: isPositiveTrend ? TrendingUp : TrendingDown,
      trendColor: isPositiveTrend ? 'text-destructive' : 'text-success',
      gradient: 'bg-gradient-primary',
    },
    {
      title: 'Annual Projection',
      value: `$${annualSpend.toFixed(2)}`,
      icon: Calendar,
      trend: 'Based on current',
      trendIcon: null,
      trendColor: 'text-subtle',
      gradient: 'bg-gradient-success',
    },
    {
      title: 'Active Subscriptions',
      value: analytics ? Object.keys(analytics.categoryBreakdown).length.toString() : '0',
      icon: CreditCard,
      trend: 'Services tracked',
      trendIcon: null,
      trendColor: 'text-subtle',
      gradient: 'bg-accent',
    },
    {
      title: 'Upcoming Payments',
      value: upcomingCount.toString(),
      icon: Calendar,
      trend: 'Next 30 days',
      trendIcon: null,
      trendColor: 'text-subtle',
      gradient: 'bg-warning/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="bg-card border-card-border hover:shadow-md transition-smooth animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              
              {stat.trendIcon && (
                <div className={`flex items-center gap-1 ${stat.trendColor}`}>
                  <stat.trendIcon className="h-4 w-4" />
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </h3>
              <p className={`text-sm ${stat.trendColor} flex items-center gap-1`}>
                {stat.trendIcon && <stat.trendIcon className="h-3 w-3" />}
                {stat.trend}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};