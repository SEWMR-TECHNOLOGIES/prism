"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TaskCard } from "@/components/tasks/task-card";
import { AddTaskForm } from "@/components/tasks/add-task-form";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { format, isSameMonth, isSameDay, startOfMonth } from "date-fns";

export default function CalendarPage() {
  const {
    tasks,
    addTask,
    toggleTaskStatus,
    deleteTask,
  } = useTasks();

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // selectedDate = the date the user clicked on the calendar (events-on-date)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // visibleMonth = the month currently shown in the calendar (used for top summary and monthly list)
  // initialize to the start of current month
  const [visibleMonth, setVisibleMonth] = useState<Date>(startOfMonth(new Date()));

  const { toast } = useToast();

  // All tasks that belong to the currently visible month
  const monthlyTasks = useMemo(() => {
    return tasks.filter(
      (task) => task.dueDate && isSameMonth(new Date(task.dueDate), visibleMonth)
    );
  }, [tasks, visibleMonth]);

  // Events on the selected date (click on a date)
  const eventsOnDate = useMemo(() => {
    return tasks.filter(
      (task) => task.dueDate && isSameDay(new Date(task.dueDate), selectedDate)
    );
  }, [tasks, selectedDate]);

  // Monthly stats computed from tasks in the visible month
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const stats = {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
    };

    monthlyTasks.forEach((task) => {
      stats.total++;
      if (task.status === "completed") {
        stats.completed++;
      } else {
        stats.pending++;
        if (task.dueDate && new Date(task.dueDate) < now) {
          stats.overdue++;
        }
      }
    });

    return stats;
  }, [monthlyTasks]);

  // Add a task
  const handleAddTask = (taskData: any) => {
    addTask(taskData);
    toast({
      title: "Task created",
      description: "Your new task has been added successfully.",
    });
  };

  // Toggle status
  const handleToggleStatus = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      toggleTaskStatus(id);
      toast({
        title: task.status === "pending" ? "Task completed" : "Task reopened",
        description:
          task.status === "pending"
            ? `Great job completing "${task.title}"!`
            : `"${task.title}" has been marked as pending.`,
      });
    }
  };

  // Delete
  const handleDeleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && deleteTask(id)) {
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been deleted.`,
        variant: "destructive",
      });
    }
  };

  // Handler when calendar month view changes (user navigates months)
  // NOTE: many calendar components support an onMonthChange(date) prop.
  // If your Calendar component uses a different prop name, adapt accordingly.
  const handleMonthChange = (date?: Date) => {
    if (date) {
      setVisibleMonth(startOfMonth(date));
      // optionally update selectedDate to first day of that month
      // keep selectedDate unchanged so user retains clicked date unless they click another
    }
  };

  return (
    <div className="space-y-8 pt-4 lg:pt-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prism Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Manage tasks, track deadlines, and visualize your schedule.
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

      {/* Top summary — now reflects the currently visible month */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={`Total (${format(visibleMonth, "MMMM yyyy")})`}
          value={monthlyStats.total}
          icon={Target}
          color="bg-primary/10 text-primary border-primary/20"
          description="Tasks this month"
        />
        <StatsCard
          title="Completed"
          value={monthlyStats.completed}
          icon={CheckCircle}
          color="bg-success/10 text-success border-success/20"
          description={
            monthlyStats.total > 0
              ? `${Math.round((monthlyStats.completed / monthlyStats.total) * 100)}% completion`
              : "0% completion"
          }
        />
        <StatsCard
          title="Pending"
          value={monthlyStats.pending}
          icon={Clock}
          color="bg-silver/10 text-silver border-silver/20"
          description="Tasks in progress"
        />
        <StatsCard
          title="Overdue"
          value={monthlyStats.overdue}
          icon={AlertTriangle}
          color="bg-destructive/10 text-destructive border-destructive/20"
          description="Need immediate attention"
        />
      </div>

      {/* Main Calendar + Task List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar (left) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Calendar</h2>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);
                // ensure visibleMonth follows selection so top-summary updates when user clicks a date in another month
                setVisibleMonth(startOfMonth(date));
              }
            }}
            // try to capture month navigation — many calendar components support onMonthChange
            onMonthChange={(date?: Date) => handleMonthChange(date)}
            className="rounded-md border"
          />
        </div>

        {/* Right side: Events on selected date + Tasks in visible month */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-2">
            Events on {format(selectedDate, "PPP")}
          </h2>

          {eventsOnDate.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No events on this date</p>
            </div>
          ) : (
            <div className="space-y-3 mb-4 max-h-44 overflow-y-auto pr-1">
              {eventsOnDate.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}

          <hr className="my-4" />

          <h3 className="text-lg font-semibold mb-3">
            Tasks in {format(visibleMonth, "MMMM yyyy")}
          </h3>

          {monthlyTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tasks for this month</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {monthlyTasks.map((task) => (
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
      </div>

      {/* Add Task Modal */}
      <AddTaskForm
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onSubmit={handleAddTask}
      />
    </div>
  );
}
