import { Goal, GoalStatus, GoalTimeframe } from '@/types/goal';
import { Category } from '@/types/task';

class GoalStore {
  private goals: Goal[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      this.goals = JSON.parse(savedGoals).map((goal: Goal) => ({
        ...goal,
        createdAt: new Date(goal.createdAt),
        updatedAt: new Date(goal.updatedAt),
      }));
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('goals', JSON.stringify(this.goals));
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.saveToLocalStorage();
    this.listeners.forEach(listener => listener());
  }

  getAllGoals(): Goal[] {
    return [...this.goals];
  }

  getGoalById(id: string): Goal | undefined {
    return this.goals.find(goal => goal.id === id);
  }

  addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Goal {
    const newGoal: Goal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.goals.push(newGoal);
    this.notify();
    return newGoal;
  }

  updateGoal(id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>): Goal | null {
    const goalIndex = this.goals.findIndex(goal => goal.id === id);
    if (goalIndex === -1) return null;

    this.goals[goalIndex] = {
      ...this.goals[goalIndex],
      ...updates,
      updatedAt: new Date(),
    };

    this.notify();
    return this.goals[goalIndex];
  }

  deleteGoal(id: string): boolean {
    const initialLength = this.goals.length;
    this.goals = this.goals.filter(goal => goal.id !== id);

    if (this.goals.length < initialLength) {
      this.notify();
      return true;
    }
    return false;
  }

  getGoalsByTimeframe(timeframe: GoalTimeframe): Goal[] {
    return this.goals.filter(goal => goal.timeframe === timeframe);
  }

  getGoalsByCategory(category: Category): Goal[] {
    return this.goals.filter(goal => goal.category === category);
  }

  getGoalsByStatus(status: GoalStatus): Goal[] {
    return this.goals.filter(goal => {
      if (status === 'completed') {
        return goal.target <= 0;
      } else if (status === 'on-track') {
        return goal.target > 0;
      } else if (status === 'behind') {
        return goal.target < 0;
      }
      return false;
    });
  }
}

export const goalStore = new GoalStore();
