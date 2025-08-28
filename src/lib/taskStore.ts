import { Task, TaskStats, Priority, Category, TaskStatus } from '@/types/task';

// localStorage-backed task store
class TaskStore {
  private tasks: Task[] = [];
  private readonly STORAGE_KEY = 'tasks';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        this.tasks = parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        }));
      } else {
        // Initialize with default tasks if no storage
        this.tasks = [
          {
            id: '1',
            title: 'Review quarterly reports',
            description: 'Analyze Q3 performance metrics and prepare presentation',
            category: 'work',
            priority: 'high',
            status: 'pending',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: ['reports', 'quarterly']
          },
          {
            id: '2',
            title: 'Domain renewal reminder',
            description: 'mywebsite.com expires in 30 days',
            category: 'work',
            priority: 'urgent',
            status: 'pending',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: ['domain', 'renewal']
          },
          {
            id: '3',
            title: 'Doctor appointment',
            description: 'Annual health checkup',
            category: 'health',
            priority: 'medium',
            status: 'pending',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: ['health', 'checkup']
          },
          {
            id: '4',
            title: 'Finish project proposal',
            description: 'Complete the new client project proposal',
            category: 'work',
            priority: 'high',
            status: 'completed',
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            completedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: ['proposal', 'client']
          }
        ];
        this.saveToStorage();
      }
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
      this.tasks = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
    }
  }

  private listeners: Array<() => void> = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach(listener => listener());
  }

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.tasks.push(newTask);
    this.notify();
    return newTask;
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return null;

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.notify();
    return this.tasks[taskIndex];
  }

  deleteTask(id: string): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    
    if (this.tasks.length < initialLength) {
      this.notify();
      return true;
    }
    return false;
  }

  toggleTaskStatus(id: string): Task | null {
    const task = this.getTaskById(id);
    if (!task) return null;

    const updates: Partial<Task> = {
      status: task.status === 'completed' ? 'pending' : 'completed'
    };

    if (updates.status === 'completed') {
      updates.completedAt = new Date();
    } else {
      updates.completedAt = undefined;
    }

    return this.updateTask(id, updates);
  }

  getTaskStats(): TaskStats {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const stats = this.tasks.reduce((acc, task) => {
      acc.total++;
      
      if (task.status === 'completed') {
        acc.completed++;
      } else {
        acc.pending++;
        
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
          
          if (dueDateOnly < today) {
            acc.overdue++;
          } else if (dueDateOnly.getTime() === today.getTime()) {
            acc.dueToday++;
          } else if (dueDateOnly.getTime() === tomorrow.getTime()) {
            acc.dueTomorrow++;
          }
        }
      }
      
      return acc;
    }, {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
      dueToday: 0,
      dueTomorrow: 0
    });

    return stats;
  }

  getTasksByCategory(category: Category): Task[] {
    return this.tasks.filter(task => task.category === category);
  }

  getTasksByPriority(priority: Priority): Task[] {
    return this.tasks.filter(task => task.priority === priority);
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  getUpcomingTasks(days: number = 7): Task[] {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return this.tasks
      .filter(task => 
        task.status === 'pending' && 
        task.dueDate && 
        new Date(task.dueDate) <= futureDate
      )
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  }

  getOverdueTasks(): Task[] {
    const now = new Date();
    return this.tasks
      .filter(task => 
        task.status === 'pending' && 
        task.dueDate && 
        new Date(task.dueDate) < now
      )
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  }
}

export const taskStore = new TaskStore();