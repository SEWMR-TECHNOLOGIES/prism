import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from '@/components/tasks/task-card';
import { AddTaskForm } from '@/components/tasks/add-task-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Task, Priority, Category, TaskStatus } from '@/types/task';

export default function Tasks() {
  const { 
    tasks, 
    addTask, 
    updateTask,
    toggleTaskStatus, 
    deleteTask 
  } = useTasks();
  
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const { toast } = useToast();

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const handleAddTask = (taskData: any) => {
    addTask(taskData);
    toast({
      title: "Task created",
      description: "Your new task has been added successfully."
    });
  };

  const handleEditTask = (taskData: any) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully."
      });
    }
  };

  const handleToggleStatus = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      toggleTaskStatus(id);
      toast({
        title: task.status === 'pending' ? "Task completed" : "Task reopened",
        description: task.status === 'pending' 
          ? `Great job completing "${task.title}"!` 
          : `"${task.title}" has been marked as pending.`
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && deleteTask(id)) {
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been deleted.`,
        variant: "destructive"
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterCategory('all');
    setFilterPriority('all');
    setFilterStatus('all');
  };

  const hasActiveFilters = searchQuery || filterCategory !== 'all' || 
                          filterPriority !== 'all' || filterStatus !== 'all';

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              All Tasks
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and organize all your tasks
            </p>
          </div>
          <Button 
            onClick={() => setIsAddTaskOpen(true)}
            className="gradient-primary text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="glass-card p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as Category | 'all')}>
                <SelectTrigger className="w-[140px]">
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

              <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as Priority | 'all')}>
                <SelectTrigger className="w-[130px]">
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

              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as TaskStatus | 'all')}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              {searchQuery && (
                <Badge variant="secondary">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {filterCategory !== 'all' && (
                <Badge variant="secondary">
                  Category: {filterCategory}
                </Badge>
              )}
              {filterPriority !== 'all' && (
                <Badge variant="secondary">
                  Priority: {filterPriority}
                </Badge>
              )}
              {filterStatus !== 'all' && (
                <Badge variant="secondary">
                  Status: {filterStatus}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400">
              {tasks.filter(t => t.status === 'completed').length} Completed
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-400">
              {tasks.filter(t => t.status === 'pending').length} Pending
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-red-400">
              {tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status === 'pending').length} Overdue
            </span>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first task'
                }
              </p>
              {!hasActiveFilters && (
                <Button onClick={() => setIsAddTaskOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Task
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                    <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteTask}
                  onEdit={(task) => {
                    setEditingTask(task);
                  }}
                    />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddTaskForm
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onSubmit={handleAddTask}
      />

      <AddTaskForm
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onSubmit={handleEditTask}
        initialData={editingTask || undefined}
      />
    </div>
  );
}