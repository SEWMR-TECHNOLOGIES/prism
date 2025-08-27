import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/hooks/useTasks';
import { format } from 'date-fns';
import { Search, Archive, Trash2, RotateCcw, Calendar, CheckCircle2 } from 'lucide-react';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { CategoryBadge } from '@/components/ui/category-badge';
import { Category, Priority } from '@/types/task';

export default function ArchivePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const { tasks, toggleTaskStatus, deleteTask } = useTasks();

  const completedTasks = tasks.filter(task => task.status === 'completed');

  const filteredTasks = completedTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const totalCompleted = completedTasks.length;
  const thisWeekCompleted = completedTasks.filter(task => {
    if (!task.completedAt) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(task.completedAt) >= weekAgo;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Archive</h1>
          <p className="text-muted-foreground">View and manage completed tasks</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-green-500">{totalCompleted}</div>
            <div className="text-xs text-muted-foreground">Total Completed</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-500">{thisWeekCompleted}</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['work', 'personal', 'health', 'finance'] as Category[]).map(category => {
          const count = completedTasks.filter(task => task.category === category).length;
          return (
            <Card key={category} className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{count}</div>
                <CategoryBadge category={category} showIcon={false} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search completed tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-input"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as Category | 'all')}>
              <SelectTrigger className="w-full sm:w-40 bg-background border-input">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Priority | 'all')}>
              <SelectTrigger className="w-full sm:w-40 bg-background border-input">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No completed tasks found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Complete some tasks to see them here.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className="bg-card border-border hover:border-border/80 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      <h3 className="font-medium text-foreground line-through opacity-70">
                        {task.title}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <PriorityBadge priority={task.priority} />
                      <CategoryBadge category={task.category} showIcon={false} />
                    </div>

                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-3 opacity-70">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {task.completedAt && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed {format(new Date(task.completedAt), 'MMM dd, yyyy')}
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleTaskStatus(task.id)}
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Restore
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}