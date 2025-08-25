import { useState, useEffect } from 'react';
import { Task, TaskStats, Priority, Category, TaskStatus } from '@/types/task';
import { taskStore } from '@/lib/taskStore';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(taskStore.getAllTasks());
    
    const unsubscribe = taskStore.subscribe(() => {
      setTasks(taskStore.getAllTasks());
    });

    return unsubscribe;
  }, []);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    return taskStore.addTask(task);
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    return taskStore.updateTask(id, updates);
  };

  const deleteTask = (id: string) => {
    return taskStore.deleteTask(id);
  };

  const toggleTaskStatus = (id: string) => {
    return taskStore.toggleTaskStatus(id);
  };

  const getTaskStats = (): TaskStats => {
    return taskStore.getTaskStats();
  };

  const getTasksByCategory = (category: Category) => {
    return taskStore.getTasksByCategory(category);
  };

  const getTasksByPriority = (priority: Priority) => {
    return taskStore.getTasksByPriority(priority);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return taskStore.getTasksByStatus(status);
  };

  const getUpcomingTasks = (days?: number) => {
    return taskStore.getUpcomingTasks(days);
  };

  const getOverdueTasks = () => {
    return taskStore.getOverdueTasks();
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTaskStats,
    getTasksByCategory,
    getTasksByPriority,
    getTasksByStatus,
    getUpcomingTasks,
    getOverdueTasks
  };
}