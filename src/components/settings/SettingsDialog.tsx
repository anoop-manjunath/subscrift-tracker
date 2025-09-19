// Settings Dialog - Comprehensive User Preferences
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateSettingsRequested, resetSettings } from '../../features/settings/settingsSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Settings, Globe, Calendar, DollarSign, Clock, RotateCcw } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (New York)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
  { value: 'Europe/London', label: 'British Time (London)' },
  { value: 'Europe/Paris', label: 'Central European Time (Paris)' },
  { value: 'Asia/Tokyo', label: 'Japan Time (Tokyo)' },
  { value: 'Asia/Kolkata', label: 'India Time (Mumbai/Delhi)' },
  { value: 'Asia/Shanghai', label: 'China Time (Shanghai)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (Sydney)' },
];

const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '12/25/2023' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '25/12/2023' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2023-12-25' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY', example: '25 Dec 2023' },
];

const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
  { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
  { value: 'CAD', label: 'Canadian Dollar (CAD)', symbol: 'CAD' },
  { value: 'AUD', label: 'Australian Dollar (AUD)', symbol: 'AUD' },
];

const LANGUAGES = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
];

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);
  
  const [localSettings, setLocalSettings] = useState({
    timezone: settings.timezone,
    dateFormat: settings.dateFormat,
    currency: settings.currency,
    language: settings.language,
  });

  // Update local state when settings change
  useEffect(() => {
    setLocalSettings({
      timezone: settings.timezone,
      dateFormat: settings.dateFormat,
      currency: settings.currency,
      language: settings.language,
    });
  }, [settings]);

  const handleSave = () => {
    dispatch(updateSettingsRequested(localSettings));
    toast({
      title: t('common.success'),
      description: t('settings.notifications.settingsUpdated'),
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalSettings({
      timezone: settings.timezone,
      dateFormat: settings.dateFormat,
      currency: settings.currency,
      language: settings.language,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    dispatch(resetSettings());
    toast({
      title: t('common.success'),
      description: t('settings.notifications.settingsUpdated'),
    });
  };

  const hasChanges = Object.keys(localSettings).some(
    key => localSettings[key as keyof typeof localSettings] !== settings[key as keyof typeof settings]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('settings.title')}
          </DialogTitle>
          <DialogDescription>
            {t('settings.subtitle')}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">{t('settings.tabs.general')}</TabsTrigger>
            <TabsTrigger value="display">{t('settings.tabs.display')}</TabsTrigger>
            <TabsTrigger value="localization">{t('settings.tabs.localization')}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 mt-6">
            {/* Timezone Setting */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t('settings.timezone.label')}
              </Label>
              <Select
                value={localSettings.timezone}
                onValueChange={(value) => setLocalSettings(prev => ({ ...prev, timezone: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.timezone.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {t('settings.timezone.description')}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-6 mt-6">
            {/* Date Format Setting */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('settings.dateFormat.label')}
              </Label>
              <Select
                value={localSettings.dateFormat}
                onValueChange={(value) => setLocalSettings(prev => ({ ...prev, dateFormat: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_FORMATS.map(format => (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{format.label}</span>
                        <span className="text-muted-foreground ml-4">
                          {format.example}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {t('settings.dateFormat.description')}
              </p>
            </div>

            {/* Currency Setting */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t('settings.currency.label')}
              </Label>
              <Select
                value={localSettings.currency}
                onValueChange={(value) => setLocalSettings(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.currency.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(currency => (
                    <SelectItem key={currency.value} value={currency.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{currency.label}</span>
                        <span className="text-muted-foreground ml-4">
                          {currency.symbol}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {t('settings.currency.description')}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="localization" className="space-y-6 mt-6">
            {/* Language Setting */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {t('settings.language.label')}
              </Label>
              <Select
                value={localSettings.language}
                onValueChange={(value) => setLocalSettings(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {t('settings.language.description')}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive">
                <RotateCcw className="h-4 w-4 mr-2" />
                {t('common.reset')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('common.reset')} {t('settings.title')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('settings.notifications.resetConfirm')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground">
                  {t('common.reset')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges || settings.loading}
              className="bg-gradient-primary hover:shadow-glow transition-smooth"
            >
              {settings.loading ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};