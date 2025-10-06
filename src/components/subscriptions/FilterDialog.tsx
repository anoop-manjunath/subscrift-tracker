// Subscription Filters Dialog
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, clearFilters } from '@/features/subscriptions/subscriptionsSlice';
import { SubscriptionCategory, SubscriptionStatus, Currency } from '@/types/subscription';
import { X } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.subscriptions.filters);
  const { formatPrice } = useSettings();

  const categories: SubscriptionCategory[] = [
    'streaming', 'productivity', 'cloud', 'development', 
    'design', 'marketing', 'finance', 'other'
  ];

  const statuses: SubscriptionStatus[] = ['active', 'paused', 'trial', 'canceled'];
  
  const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'INR'];

  const handleCategoryToggle = (category: SubscriptionCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    dispatch(setFilters({ categories: newCategories }));
  };

  const handleStatusToggle = (status: SubscriptionStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    dispatch(setFilters({ statuses: newStatuses }));
  };

  const handleCurrencyToggle = (currency: Currency) => {
    const newCurrencies = filters.currencies.includes(currency)
      ? filters.currencies.filter(c => c !== currency)
      : [...filters.currencies, currency];
    dispatch(setFilters({ currencies: newCurrencies }));
  };

  const handlePriceRangeChange = (values: number[]) => {
    dispatch(setFilters({ 
      priceRange: { min: values[0], max: values[1] } 
    }));
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    dispatch(setFilters({ 
      sortBy: sortBy as any, 
      sortOrder: sortOrder as 'asc' | 'desc' 
    }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const activeFilterCount = 
    filters.categories.length + 
    filters.statuses.length + 
    filters.currencies.length +
    (filters.priceRange.min > 0 || filters.priceRange.max < 10000 ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-foreground">Filter Subscriptions</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Refine your subscription list with advanced filters
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Active Filters Count */}
          {activeFilterCount > 0 && (
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <Badge variant="default">{activeFilterCount}</Badge>
                <span className="text-sm text-foreground">Active Filters</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearFilters}
                className="h-8"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}

          {/* Sort By */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Sort By</Label>
            <Select 
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="nextBillingDate-asc">Next Billing (Soonest)</SelectItem>
                <SelectItem value="nextBillingDate-desc">Next Billing (Latest)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Categories</Label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <div 
                  key={category} 
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal capitalize cursor-pointer text-foreground"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Status */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Status</Label>
            <div className="grid grid-cols-2 gap-3">
              {statuses.map((status) => (
                <div 
                  key={status} 
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.statuses.includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                  />
                  <Label
                    htmlFor={`status-${status}`}
                    className="text-sm font-normal capitalize cursor-pointer text-foreground"
                  >
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Currency */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Currency</Label>
            <div className="grid grid-cols-2 gap-3">
              {currencies.map((currency) => (
                <div 
                  key={currency} 
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`currency-${currency}`}
                    checked={filters.currencies.includes(currency)}
                    onCheckedChange={() => handleCurrencyToggle(currency)}
                  />
                  <Label
                    htmlFor={`currency-${currency}`}
                    className="text-sm font-normal cursor-pointer text-foreground"
                  >
                    {currency}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-medium">Price Range</Label>
              <span className="text-sm text-muted-foreground">
                {formatPrice(filters.priceRange.min)} - {formatPrice(filters.priceRange.max)}
              </span>
            </div>
            <Slider
              min={0}
              max={10000}
              step={100}
              value={[filters.priceRange.min, filters.priceRange.max]}
              onValueChange={handlePriceRangeChange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatPrice(0)}</span>
              <span>{formatPrice(10000)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-primary"
            onClick={() => onOpenChange(false)}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
