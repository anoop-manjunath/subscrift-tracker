// Dashboard Header - Professional Navigation and Branding
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Settings, Bell, Search } from 'lucide-react';
import { AddSubscriptionDialog } from '@/components/subscriptions/AddSubscriptionDialog';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setFilters } from '../../features/subscriptions/subscriptionsSlice';

export const DashboardHeader = () => {
  const { t } = useTranslation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { search } = useAppSelector(state => state.subscriptions.filters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  return (
    <header className="border-b border-card-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                {t('dashboard.title')}
              </h1>
              <p className="text-sm text-subtle">
                {t('dashboard.subtitle')}
              </p>
            </div>
          </div>

          {/* Search and Navigation Actions */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('common.search')}
                value={search}
                onChange={handleSearchChange}
                className="pl-10 w-64 bg-background/50 border-card-border focus:bg-background transition-fast"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-accent transition-fast"
              >
                <Bell className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-accent transition-fast"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>

              <Button 
                size="sm"
                className="bg-gradient-primary hover:shadow-glow transition-smooth"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('dashboard.addSubscription')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <AddSubscriptionDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
      <SettingsDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />
    </header>
  );
};