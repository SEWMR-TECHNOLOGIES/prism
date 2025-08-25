import { Task } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { CategoryBadge } from '@/components/ui/category-badge';
import { 
  Clock, 
  Calendar,
  Trash2,
  Check,
  Circle,
  AlertTriangle,
  CalendarClock
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, differenceInHours } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggleStatus, onDelete }: TaskCardProps) {
  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate));
  const isCompleted = task.status === 'completed';
  const isDueSoon = task.dueDate && differenceInHours(new Date(task.dueDate), new Date()) <= 48 && !isOverdue;

  return (
    <Card className={cn(
      "modern-card group",
      isCompleted && "opacity-60",
      isOverdue && "border-destructive/50 bg-destructive/5",
      isDueSoon && "border-warning/50 bg-warning/5"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Status Toggle - Made Super Obvious */}
          <button
            onClick={() => onToggleStatus(task.id)}
            className={cn(
              "shrink-0 mt-0.5 rounded-full transition-all duration-200",
              isCompleted ? "task-complete-btn" : "task-pending-btn"
            )}
          >
            {isCompleted ? (
              <Check className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-medium text-sm leading-tight",
                isCompleted && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              
              {/* Due indicators */}
              <div className="flex items-center gap-1">
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Overdue
                  </Badge>
                )}
                {isDueSoon && !isOverdue && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-warning text-warning">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    Due Soon
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {task.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Meta information */}
            <div className="flex items-center gap-2 mt-3">
              <CategoryBadge category={task.category} />
              <PriorityBadge priority={task.priority} />
              
              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue ? "text-destructive" : 
                  isDueSoon ? "text-warning" : 
                  "text-muted-foreground"
                )}>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDueDate(new Date(task.dueDate))}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}