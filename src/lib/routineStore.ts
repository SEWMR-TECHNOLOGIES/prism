import { Routine, SubTarget, DailyProgress, RoutineStats } from '@/types/routine';
import { format, isWithinInterval, parseISO, differenceInDays, startOfDay } from 'date-fns';

class RoutineStore {
  private routines: Routine[] = [];
  private readonly STORAGE_KEY = 'routines';
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.routines = parsed.map((routine: any) => ({
          ...routine,
          startDate: new Date(routine.startDate),
          endDate: new Date(routine.endDate),
          createdAt: new Date(routine.createdAt),
          updatedAt: new Date(routine.updatedAt),
          subTargets: routine.subTargets.map((st: any) => ({
            ...st,
            createdAt: new Date(st.createdAt),
            updatedAt: new Date(st.updatedAt)
          })),
          dailyProgress: routine.dailyProgress.map((dp: any) => ({
            ...dp,
            updatedAt: new Date(dp.updatedAt)
          }))
        }));
      }
    } catch (error) {
      console.error('Error loading routines from storage:', error);
      this.routines = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.routines));
    } catch (error) {
      console.error('Error saving routines to storage:', error);
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

  getAllRoutines(): Routine[] {
    return [...this.routines];
  }

  getRoutineById(id: string): Routine | undefined {
    return this.routines.find(routine => routine.id === id);
  }

  addRoutine(routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt' | 'subTargets' | 'dailyProgress'>): Routine {
    const newRoutine: Routine = {
      ...routine,
      id: Math.random().toString(36).substr(2, 9),
      subTargets: [],
      dailyProgress: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.routines.push(newRoutine);
    this.notify();
    return newRoutine;
  }

  updateRoutine(id: string, updates: Partial<Omit<Routine, 'id' | 'createdAt' | 'subTargets' | 'dailyProgress'>>): Routine | null {
    const routineIndex = this.routines.findIndex(routine => routine.id === id);
    if (routineIndex === -1) return null;

    this.routines[routineIndex] = {
      ...this.routines[routineIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.notify();
    return this.routines[routineIndex];
  }

  deleteRoutine(id: string): boolean {
    const initialLength = this.routines.length;
    this.routines = this.routines.filter(routine => routine.id !== id);
    
    if (this.routines.length < initialLength) {
      this.notify();
      return true;
    }
    return false;
  }

  // Sub-target management
  addSubTarget(routineId: string, subTarget: Omit<SubTarget, 'id' | 'createdAt' | 'updatedAt'>): SubTarget | null {
    const routine = this.getRoutineById(routineId);
    if (!routine) return null;

    const newSubTarget: SubTarget = {
      ...subTarget,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    routine.subTargets.push(newSubTarget);
    routine.updatedAt = new Date();
    this.notify();
    return newSubTarget;
  }

  updateSubTarget(routineId: string, subTargetId: string, updates: Partial<Omit<SubTarget, 'id' | 'createdAt'>>): SubTarget | null {
    const routine = this.getRoutineById(routineId);
    if (!routine) return null;

    const subTargetIndex = routine.subTargets.findIndex(st => st.id === subTargetId);
    if (subTargetIndex === -1) return null;

    routine.subTargets[subTargetIndex] = {
      ...routine.subTargets[subTargetIndex],
      ...updates,
      updatedAt: new Date()
    };
    routine.updatedAt = new Date();
    this.notify();
    return routine.subTargets[subTargetIndex];
  }

  deleteSubTarget(routineId: string, subTargetId: string): boolean {
    const routine = this.getRoutineById(routineId);
    if (!routine) return false;

    const initialLength = routine.subTargets.length;
    routine.subTargets = routine.subTargets.filter(st => st.id !== subTargetId);
    
    // Also remove all daily progress for this sub-target
    routine.dailyProgress = routine.dailyProgress.filter(dp => dp.subTargetId !== subTargetId);
    
    if (routine.subTargets.length < initialLength) {
      routine.updatedAt = new Date();
      this.notify();
      return true;
    }
    return false;
  }

  // Daily progress tracking
  updateDailyProgress(routineId: string, subTargetId: string, date: Date, completed: boolean): boolean {
    const routine = this.getRoutineById(routineId);
    if (!routine) return false;

    const dateStr = format(date, 'yyyy-MM-dd');
    const existingProgressIndex = routine.dailyProgress.findIndex(
      dp => dp.subTargetId === subTargetId && dp.date === dateStr
    );

    if (existingProgressIndex >= 0) {
      routine.dailyProgress[existingProgressIndex] = {
        ...routine.dailyProgress[existingProgressIndex],
        completed,
        updatedAt: new Date()
      };
    } else {
      routine.dailyProgress.push({
        date: dateStr,
        subTargetId,
        completed,
        updatedAt: new Date()
      });
    }

    routine.updatedAt = new Date();
    this.notify();
    return true;
  }

  getDailyProgress(routineId: string, subTargetId: string, date: Date): boolean {
    const routine = this.getRoutineById(routineId);
    if (!routine) return false;

    const dateStr = format(date, 'yyyy-MM-dd');
    const progress = routine.dailyProgress.find(
      dp => dp.subTargetId === subTargetId && dp.date === dateStr
    );
    
    return progress?.completed || false;
  }

  getRoutineStats(routineId: string): RoutineStats | null {
    const routine = this.getRoutineById(routineId);
    if (!routine) return null;

    const today = startOfDay(new Date());
    const todayStr = format(today, 'yyyy-MM-dd');
    
    const totalSubTargets = routine.subTargets.length;
    const totalDays = differenceInDays(routine.endDate, routine.startDate) + 1;

    // Daily completion rate (today)
    const todayCompletedCount = routine.dailyProgress.filter(
      dp => dp.date === todayStr && dp.completed
    ).length;
    const dailyCompletionRate = totalSubTargets > 0 ? (todayCompletedCount / totalSubTargets) * 100 : 0;

    // Overall progress
    const totalPossibleCompletions = totalSubTargets * totalDays;
    const actualCompletions = routine.dailyProgress.filter(dp => dp.completed).length;
    const overallProgress = totalPossibleCompletions > 0 ? (actualCompletions / totalPossibleCompletions) * 100 : 0;

    return {
      totalSubTargets,
      totalDays,
      dailyCompletionRate,
      overallProgress,
      currentStreak: 0, // TODO: implement streak calculation
      longestStreak: 0  // TODO: implement streak calculation
    };
  }

  getActiveRoutines(): Routine[] {
    const today = new Date();
    return this.routines.filter(routine => 
      isWithinInterval(today, { start: routine.startDate, end: routine.endDate })
    );
  }
}

export const routineStore = new RoutineStore();