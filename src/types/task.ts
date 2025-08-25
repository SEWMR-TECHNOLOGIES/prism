export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type Category = 'work' | 'personal' | 'health' | 'finance' | 'other';

export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueToday: number;
  dueTomorrow: number;
}