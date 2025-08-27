import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useTasks';
import { format, isSameDay } from 'date-fns';
import { Plus, Clock, AlertCircle } from 'lucide-react';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { CategoryBadge } from '@/components/ui/category-badge';
import { Task } from '@/types/task';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { tasks, toggleTaskStatus } = useTasks();

  const tasksForSelectedDate = tasks.filter(task => 
    task.dueDate && isSameDay(new Date(task.dueDate), selectedDate)
  );

  const completedCount = tasksForSelectedDate.filter(task => task.status === 'completed').length;
  const pendingCount = tasksForSelectedDate.filter(task => task.status === 'pending').length;

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  const renderDayContent = (date: Date) => {
    const dayTasks = getTasksForDate(date);
    if (dayTasks.length === 0) return null;

    const urgent = dayTasks.filter(task => task.priority === 'urgent').length;
    const high = dayTasks.filter(task => task.priority === 'high').length;

    return (
      <div className="w-full flex justify-center">
        <div className="flex gap-1">
          {urgent > 0 && (
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
          )}
          {high > 0 && (
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
          )}
          {dayTasks.length > urgent + high && (
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Track your tasks by date</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Task Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full"
              components={{
                DayContent: ({ date }) => (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <span>{date.getDate()}</span>
                    {renderDayContent(date)}
                  </div>
                )
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Tasks */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {format(selectedDate, 'MMM dd, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{completedCount}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{pendingCount}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks for selected date */}
          <div className="space-y-3">
            {tasksForSelectedDate.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center text-muted-foreground">
                  No tasks for this date
                </CardContent>
              </Card>
            ) : (
              tasksForSelectedDate.map((task) => (
                <Card key={task.id} className="bg-card border-border hover:border-border/80 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-medium text-sm text-foreground ${
                            task.status === 'completed' ? 'line-through opacity-60' : ''
                          }`}>
                            {task.title}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          <PriorityBadge priority={task.priority} />
                          <CategoryBadge category={task.category} showIcon={false} />
                        </div>

                        {task.description && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <Button
                        variant={task.status === 'completed' ? 'secondary' : 'default'}
                        size="sm"
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`shrink-0 ${
                          task.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/50' 
                            : 'bg-primary hover:bg-primary/90'
                        }`}
                      >
                        {task.status === 'completed' ? 'Done' : 'Mark Done'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}