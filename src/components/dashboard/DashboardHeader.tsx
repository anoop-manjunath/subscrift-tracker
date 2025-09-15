// Dashboard Header - Professional Navigation and Branding
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Bell } from 'lucide-react';

export const DashboardHeader = () => {
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
                SubTracker Pro
              </h1>
              <p className="text-sm text-subtle">
                Manage your subscriptions with confidence
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
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
            >
              <Settings className="h-5 w-5" />
            </Button>

            <Button 
              size="sm"
              className="bg-gradient-primary hover:shadow-glow transition-smooth"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};