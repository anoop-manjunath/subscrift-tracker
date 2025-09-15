// Upcoming Payments - Next Billing Alerts
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock } from 'lucide-react';
import { SpendingAnalytics } from '../../types/subscription';

interface UpcomingPaymentsProps {
  payments: SpendingAnalytics['upcomingPayments'];
  loading: boolean;
}

export const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({ payments, loading }) => {
  if (loading) {
    return (
      <Card className="bg-card border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Payments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getBadgeVariant = (days: number) => {
    if (days <= 1) return 'destructive';
    if (days <= 3) return 'secondary';
    return 'outline';
  };

  return (
    <Card className="bg-card border-card-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Payments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming payments in the next 30 days</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.slice(0, 5).map((payment, index) => {
              const daysUntil = getDaysUntil(payment.date);
              
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-fast animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-medium">
                        {payment.subscriptions.length}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {payment.subscriptions.length === 1 
                          ? payment.subscriptions[0].name
                          : `${payment.subscriptions.length} subscriptions`
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(payment.date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ${payment.totalAmount.toFixed(2)}
                    </p>
                    <Badge 
                      variant={getBadgeVariant(daysUntil)}
                      className="text-xs"
                    >
                      {daysUntil <= 1 ? 'Due soon' : `${daysUntil}d`}
                    </Badge>
                  </div>
                </div>
              );
            })}
            
            {payments.length > 5 && (
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  +{payments.length - 5} more payments this month
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};