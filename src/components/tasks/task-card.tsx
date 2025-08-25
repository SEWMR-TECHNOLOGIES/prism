import { Task } from '@/types/task';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { CategoryBadge } from '@/components/ui/category-badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, onToggleStatus, onEdit, onDelete }: TaskCardProps) {
  const isCompleted = task.status === 'completed';
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isCompleted;
  
  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  return (
    <Card className={cn(
      'glass-card hover:shadow-medium transition-all duration-200 animate-slide-up',
      isCompleted && 'opacity-60',
      isOverdue && 'border-red-500/50 bg-red-500/5'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => onToggleStatus(task.id)}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <h3 className={cn(
                'font-semibold leading-tight',
                isCompleted && 'line-through text-muted-foreground'
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CategoryBadge category={task.category} />
            <PriorityBadge priority={task.priority} />
          </div>
          
          {task.dueDate && (
            <div className={cn(
              'flex items-center gap-1 text-xs',
              isOverdue ? 'text-red-400' : 'text-muted-foreground'
            )}>
              <Calendar className="h-3 w-3" />
              <span>{formatDueDate(new Date(task.dueDate))}</span>
              {isOverdue && <Clock className="h-3 w-3 ml-1" />}
            </div>
          )}
        </div>
        
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {task.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-muted/50 text-xs rounded-full text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}