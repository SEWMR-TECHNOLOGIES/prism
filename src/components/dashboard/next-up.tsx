import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { CategoryBadge } from '@/components/ui/category-badge';
import { Clock, Calendar, Check, AlertTriangle } from 'lucide-react';
import { format, isToday, isTomorrow, differenceInHours } from 'date-fns';
import { cn } from '@/lib/utils';

interface NextUpProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
}

export function NextUp({ tasks, onToggleStatus }: NextUpProps) {
  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  // Get next 3 most urgent pending tasks
  const nextTasks = tasks
    .filter(task => task.status === 'pending' && task.dueDate)
    .sort((a, b) => {
      const aDate = new Date(a.dueDate!);
      const bDate = new Date(b.dueDate!);
      
      // Priority: overdue > due today > due tomorrow > priority weight > due date
      const aOverdue = aDate < new Date();
      const bOverdue = bDate < new Date();
      
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      
      const aPriorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 }[a.priority];
      const bPriorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 }[b.priority];
      
      return aDate.getTime() - bDate.getTime() || bPriorityWeight - aPriorityWeight;
    })
    .slice(0, 3);

  if (nextTasks.length === 0) {
    return (
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-silver" />
            Next Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming tasks
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-silver" />
          Next Up
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {nextTasks.map((task) => {
            const dueDate = new Date(task.dueDate!);
            const isOverdue = dueDate < new Date();
            const isDueSoon = differenceInHours(dueDate, new Date()) <= 24;
            
            return (
              <div
                key={task.id}
                className={cn(
                  'p-3 rounded-lg border transition-all duration-150 hover:bg-accent/50',
                  isOverdue && 'border-destructive/50 bg-destructive/5',
                  isDueSoon && !isOverdue && 'border-warning/50 bg-warning/5'
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleStatus(task.id)}
                    className="task-pending-btn mt-0.5 hover:bg-success/20 hover:border-success/40"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm truncate">
                        {task.title}
                      </h4>
                      {isOverdue && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                          <AlertTriangle className="h-2 w-2 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1.5">
                      <CategoryBadge category={task.category} showIcon={false} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                    
                    <div className={cn(
                      'flex items-center gap-1 text-xs mt-1.5',
                      isOverdue ? 'text-destructive' : 
                      isDueSoon ? 'text-warning' : 
                      'text-muted-foreground'
                    )}>
                      <Calendar className="h-3 w-3" />
                      <span>{formatDueDate(dueDate)}</span>
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