import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { CategoryBadge } from '@/components/ui/category-badge';
import { Calendar, Clock } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { cn } from '@/lib/utils';

interface UpcomingTasksProps {
  tasks: Task[];
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const sortedTasks = tasks
    .filter(task => task.dueDate && task.status === 'pending')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No upcoming tasks
          </p>
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task) => {
              const dueDate = new Date(task.dueDate!);
              const isOverdue = isPast(dueDate);
              
              return (
                <div
                  key={task.id}
                  className={cn(
                    'p-3 rounded-lg border transition-colors hover:bg-muted/50',
                    isOverdue && 'border-red-500/50 bg-red-500/5'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <CategoryBadge category={task.category} showIcon={false} />
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>
                    <div className={cn(
                      'flex items-center gap-1 text-xs shrink-0',
                      isOverdue ? 'text-red-400' : 'text-muted-foreground'
                    )}>
                      {isOverdue && <Clock className="h-3 w-3" />}
                      <span>{formatDueDate(dueDate)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}