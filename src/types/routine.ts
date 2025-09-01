export interface SubTarget {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD format
  subTargetId: string;
  completed: boolean;
  updatedAt: Date;
}

export interface Routine {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  subTargets: SubTarget[];
  dailyProgress: DailyProgress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutineStats {
  totalSubTargets: number;
  totalDays: number;
  dailyCompletionRate: number; // % of sub-targets completed today
  overallProgress: number; // % completed in entire range
  currentStreak: number;
  longestStreak: number;
  averageDailySuccess: number;
  successScore: number;
}

export interface SubTargetStats {
  successRate: number;
  bestStreak: number;
  completedDays: number;
  totalDays: number;
}