import { useTasks } from '@/hooks/useTasks';
import { StatsCard } from '@/components/dashboard/stats-card';
import { UpcomingTasks } from '@/components/dashboard/upcoming-tasks';
import { TaskCard } from '@/components/tasks/task-card';
import { AddTaskForm } from '@/components/tasks/add-task-form';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Calendar,
  Plus,
  Target
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { 
    tasks, 
    addTask, 
    toggleTaskStatus, 
    deleteTask, 
    getTaskStats, 
    getUpcomingTasks, 
    getOverdueTasks 
  } = useTasks();
  
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const { toast } = useToast();
  
  const stats = getTaskStats();
  const upcomingTasks = getUpcomingTasks(7);
  const overdueTasks = getOverdueTasks();
  const recentTasks = tasks.slice(0, 6);

  const handleAddTask = (taskData: any) => {
    addTask(taskData);
    toast({
      title: "Task created",
      description: "Your new task has been added successfully."
    });
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your tasks and stay organized
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Tasks"
            value={stats.total}
            icon={Target}
            color="bg-primary/20 text-primary"
            description="All tasks created"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            color="bg-green-500/20 text-green-400"
            description={`${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate`}
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            color="bg-blue-500/20 text-blue-400"
            description="Tasks in progress"
          />
          <StatsCard
            title="Overdue"
            value={stats.overdue}
            icon={AlertTriangle}
            color="bg-red-500/20 text-red-400"
            description="Need immediate attention"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Recent Tasks</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            {recentTasks.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first task
                </p>
                <Button onClick={() => setIsAddTaskOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Task
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {recentTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <UpcomingTasks tasks={upcomingTasks} />
            
            {overdueTasks.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Overdue Tasks
                </h3>
                <div className="space-y-3">
                  {overdueTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <h4 className="font-medium text-sm text-red-400">{task.title}</h4>
                      <p className="text-xs text-red-300 mt-1">
                        Due: {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddTaskForm
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onSubmit={handleAddTask}
      />
    </div>
  );
}