export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  timeframe: 'weekly' | 'monthly';
  category: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

// localStorage-backed goal store
class GoalStore {
  private goals: Goal[] = [];
  private readonly STORAGE_KEY = 'goals';
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        this.goals = parsed.map((goal: any) => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
          updatedAt: new Date(goal.updatedAt)
        }));
      } else {
        // Initialize with default goals if no storage
        this.goals = [
          {
            id: '1',
            title: 'Complete Work Tasks',
            target: 10,
            current: 7,
            timeframe: 'weekly' as const,
            category: 'work',
            color: 'blue',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '2',
            title: 'Exercise Sessions',
            target: 12,
            current: 8,
            timeframe: 'weekly' as const,
            category: 'health',
            color: 'green',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '3',
            title: 'Finish Monthly Project',
            target: 1,
            current: 0,
            timeframe: 'monthly' as const,
            category: 'work',
            color: 'purple',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        this.saveToStorage();
      }
    } catch (error) {
      console.error('Error loading goals from storage:', error);
      this.goals = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.goals));
    } catch (error) {
      console.error('Error saving goals to storage:', error);
    }
  }

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
      updatedAt: new Date()
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
      updatedAt: new Date()
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

  getGoalsByTimeframe(timeframe: 'weekly' | 'monthly'): Goal[] {
    return this.goals.filter(goal => goal.timeframe === timeframe);
  }
}

export const goalStore = new GoalStore();