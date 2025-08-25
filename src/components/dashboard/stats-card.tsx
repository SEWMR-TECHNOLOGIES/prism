import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  description,
  trend 
}: StatsCardProps) {
  return (
    <Card className="glass-card hover:shadow-medium transition-all duration-200 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          'p-2 rounded-lg transition-all duration-200 group-hover:scale-110',
          color
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className={cn(
            'flex items-center text-xs mt-2',
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          )}>
            <span className={cn(
              'mr-1',
              trend.isPositive ? '↗' : '↘'
            )}>
              {trend.isPositive ? '↗' : '↘'}
            </span>
            {Math.abs(trend.value)}% from last week
          </div>
        )}
      </CardContent>
    </Card>
  );
}