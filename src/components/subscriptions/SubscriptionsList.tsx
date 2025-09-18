// Subscriptions List - Main Data Table Component
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CreditCard, 
  MoreHorizontal, 
  Search, 
  Filter,
  Plus,
  ExternalLink,
  Pause,
  Play,
  Trash2
} from 'lucide-react';
import { Subscription } from '../../types/subscription';
import { AddSubscriptionDialog } from './AddSubscriptionDialog';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setFilters } from '../../features/subscriptions/subscriptionsSlice';

interface SubscriptionsListProps {
  subscriptions: Subscription[];
  loading: boolean;
}

export const SubscriptionsList: React.FC<SubscriptionsListProps> = ({ 
  subscriptions, 
  loading 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { search } = useAppSelector(state => state.subscriptions.filters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value }));
  };
  if (loading) {
    return (
      <Card className="bg-card border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Your Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'paused': return 'bg-warning text-warning-foreground';
      case 'canceled': return 'bg-destructive text-destructive-foreground';
      case 'trial': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: Subscription['category']) => {
    const colors = {
      streaming: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      productivity: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      cloud: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      development: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      design: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      marketing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      finance: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
    };
    return colors[category] || colors.other;
  };

  const formatPrice = (price: number, currency: string) => {
    const amount = price / 100; // Convert from minor units
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatNextBilling = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Overdue';
    if (diffDays < 7) return `${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="bg-card border-card-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CreditCard className="h-5 w-5 text-primary" />
            Your Subscriptions
            <Badge variant="outline" className="ml-2">
              {subscriptions.length}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subscriptions..."
                value={search}
                onChange={handleSearchChange}
                className="pl-10 w-64 bg-background/50 border-card-border focus:bg-background transition-fast"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" className="bg-gradient-primary" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No subscriptions yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your subscriptions to get insights into your spending
            </p>
            <Button className="bg-gradient-primary" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Subscription
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((subscription, index) => (
              <div 
                key={subscription.id}
                className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Logo/Icon */}
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  {subscription.logoUrl ? (
                    <img 
                      src={subscription.logoUrl} 
                      alt={subscription.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <span className="text-primary-foreground font-medium text-sm">
                      {subscription.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Subscription Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {subscription.name}
                    </h3>
                    {subscription.websiteUrl && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={getCategoryColor(subscription.category)}
                    >
                      {subscription.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {subscription.billingCycle}ly
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {formatPrice(subscription.price, subscription.currency)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    per {subscription.billingCycle.slice(0, -2)}
                  </p>
                </div>

                {/* Next Billing */}
                <div className="text-right">
                  <p className="text-sm text-foreground">
                    {formatNextBilling(subscription.nextBillingDate)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    next billing
                  </p>
                </div>

                {/* Status */}
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status}
                </Badge>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {subscription.status === 'active' ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <AddSubscriptionDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </Card>
  );
};