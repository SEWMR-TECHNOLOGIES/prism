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
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-silver" />
          Upcoming Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming tasks
          </p>
        ) : (
          <div className="space-y-2">
            {sortedTasks.map((task) => {
              const dueDate = new Date(task.dueDate!);
              const isOverdue = isPast(dueDate);
              
              return (
                <div
                  key={task.id}
                  className={cn(
                    'p-2.5 rounded-md border transition-colors hover:bg-accent/50',
                    isOverdue && 'border-destructive/50 bg-destructive/5'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <CategoryBadge category={task.category} showIcon={false} />
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>
                    <div className={cn(
                      'flex items-center gap-1 text-xs shrink-0',
                      isOverdue ? 'text-destructive' : 'text-muted-foreground'
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