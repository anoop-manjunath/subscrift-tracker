// Spending Chart - Monthly Trend Visualization
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3 } from 'lucide-react';
import { SpendingAnalytics } from '../../types/subscription';
import { useSettings } from '../../hooks/useSettings';

interface SpendingChartProps {
  data: SpendingAnalytics['monthlyTrend'];
  loading: boolean;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ data, loading }) => {
  const { formatPrice } = useSettings();
  
  if (loading) {
    return (
      <Card className="bg-card border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <Skeleton className="w-full mb-2" style={{ height: `${20 + Math.random() * 80}%` }} />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxAmount = Math.max(...data.map(d => d.amount));
  const minAmount = Math.min(...data.map(d => d.amount));
  const range = maxAmount - minAmount || 1;

  return (
    <Card className="bg-card border-card-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <BarChart3 className="h-5 w-5 text-primary" />
          Monthly Spending Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between gap-2">
          {data.map((item, index) => {
            const height = ((item.amount - minAmount) / range) * 80 + 20;
            const heightInPx = (height / 100) * 256; // Convert to pixels (h-64 = 256px)
            const isHighest = item.amount === maxAmount;
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center flex-1 group relative"
              >
                {/* Value tooltip on hover */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-fast pointer-events-none z-10">
                  <div className="bg-foreground text-background text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    {formatPrice(item.amount)}
                  </div>
                </div>
                
                {/* Bar */}
                <div 
                  className={`w-full mb-2 rounded-t-lg transition-smooth cursor-pointer
                    ${isHighest 
                      ? 'bg-gradient-primary shadow-glow' 
                      : 'bg-accent hover:bg-accent/80'
                    }
                  `}
                  style={{ 
                    height: `${heightInPx}px`,
                    animationDelay: `${index * 50}ms`,
                  }}
                />
                
                {/* Month label */}
                <span className="text-xs text-muted-foreground rotate-45 origin-bottom-left">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Chart Footer */}
        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-sm text-muted-foreground">
          <span>Last 12 months</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-primary rounded"></div>
              <span>Highest</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded"></div>
              <span>Regular</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};