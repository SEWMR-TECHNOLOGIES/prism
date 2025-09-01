import { useState, useEffect } from 'react';
import { routineStore } from '@/lib/routineStore';
import { Routine, SubTarget, RoutineStats } from '@/types/routine';

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    // Initial load
    setRoutines(routineStore.getAllRoutines());

    // Subscribe to changes
    const unsubscribe = routineStore.subscribe(() => {
      setRoutines(routineStore.getAllRoutines());
    });

    return unsubscribe;
  }, []);

  const addRoutine = (routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt' | 'subTargets' | 'dailyProgress'>) => {
    return routineStore.addRoutine(routine);
  };

  const updateRoutine = (id: string, updates: Partial<Omit<Routine, 'id' | 'createdAt' | 'subTargets' | 'dailyProgress'>>) => {
    return routineStore.updateRoutine(id, updates);
  };

  const deleteRoutine = (id: string) => {
    return routineStore.deleteRoutine(id);
  };

  const getRoutineById = (id: string) => {
    return routineStore.getRoutineById(id);
  };

  const addSubTarget = (routineId: string, subTarget: Omit<SubTarget, 'id' | 'createdAt' | 'updatedAt'>) => {
    return routineStore.addSubTarget(routineId, subTarget);
  };

  const updateSubTarget = (routineId: string, subTargetId: string, updates: Partial<Omit<SubTarget, 'id' | 'createdAt'>>) => {
    return routineStore.updateSubTarget(routineId, subTargetId, updates);
  };

  const deleteSubTarget = (routineId: string, subTargetId: string) => {
    return routineStore.deleteSubTarget(routineId, subTargetId);
  };

  const updateDailyProgress = (routineId: string, subTargetId: string, date: Date, completed: boolean) => {
    return routineStore.updateDailyProgress(routineId, subTargetId, date, completed);
  };

  const getDailyProgress = (routineId: string, subTargetId: string, date: Date) => {
    return routineStore.getDailyProgress(routineId, subTargetId, date);
  };

  const getRoutineStats = (routineId: string): RoutineStats | null => {
    return routineStore.getRoutineStats(routineId);
  };

  const getActiveRoutines = () => {
    return routineStore.getActiveRoutines();
  };

  return {
    routines,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    getRoutineById,
    addSubTarget,
    updateSubTarget,
    deleteSubTarget,
    updateDailyProgress,
    getDailyProgress,
    getRoutineStats,
    getActiveRoutines
  };
}