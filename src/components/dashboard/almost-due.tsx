import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { CategoryBadge } from '@/components/ui/category-badge';
import { CalendarClock, Calendar } from 'lucide-react';
import { format, isToday, isTomorrow, differenceInHours } from 'date-fns';
import { cn } from '@/lib/utils';

interface AlmostDueProps {
  tasks: Task[];
}

export function AlmostDue({ tasks }: AlmostDueProps) {
  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  // Tasks due within 48 hours
  const almostDueTasks = tasks
    .filter(task => {
      if (task.status !== 'pending' || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const hoursUntilDue = differenceInHours(dueDate, new Date());
      return hoursUntilDue > 0 && hoursUntilDue <= 48;
    })
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 4);

  if (almostDueTasks.length === 0) {
    return null;
  }

  return (
    <Card className="modern-card border-warning/30">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-warning" />
          Almost Due
          <Badge variant="outline" className="ml-auto text-xs border-warning text-warning">
            {almostDueTasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {almostDueTasks.map((task) => {
            const dueDate = new Date(task.dueDate!);
            const hoursUntilDue = differenceInHours(dueDate, new Date());
            
            return (
              <div
                key={task.id}
                className="p-2.5 rounded-md border border-warning/20 bg-warning/5 hover:bg-warning/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate text-warning-foreground">
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <CategoryBadge category={task.category} showIcon={false} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-warning font-medium">
                      {formatDueDate(dueDate)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {hoursUntilDue}h left
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}