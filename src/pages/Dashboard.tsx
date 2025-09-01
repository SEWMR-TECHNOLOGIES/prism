import { useTasks } from '@/hooks/useTasks';
import { StatsCard } from '@/components/dashboard/stats-card';
import { UpcomingTasks } from '@/components/dashboard/upcoming-tasks';
import { NextUp } from '@/components/dashboard/next-up';
import { AlmostDue } from '@/components/dashboard/almost-due';
import { TaskCard } from '@/components/tasks/task-card';
import { AddTaskForm } from '@/components/tasks/add-task-form';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Calendar,
  Plus,
  Target,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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
    <>
      <div className="space-y-8 pt-4 lg:pt-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your tasks and stay organized
            </p>
          </div>
          <Button 
            onClick={() => setIsAddTaskOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Tasks"
            value={stats.total}
            icon={Target}
            color="bg-primary/10 text-primary border-primary/20"
            description="All tasks created"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            color="bg-success/10 text-success border-success/20"
            description={`${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate`}
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            color="bg-silver/10 text-silver border-silver/20"
            description="Tasks in progress"
          />
          <StatsCard
            title="Overdue"
            value={stats.overdue}
            icon={AlertTriangle}
            color="bg-destructive/10 text-destructive border-destructive/20"
            description="Need immediate attention"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Tasks List */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Tasks</h2>
               <Link to="/tasks">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
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
              <div className="space-y-3">
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

          {/* Right Sidebar */}
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
            <NextUp tasks={tasks} onToggleStatus={handleToggleStatus} />
            <AlmostDue tasks={tasks} />
            <UpcomingTasks tasks={upcomingTasks} />
          </div>
        </div>
      </div>

      <AddTaskForm
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onSubmit={handleAddTask}
      />
    </>
  );
}