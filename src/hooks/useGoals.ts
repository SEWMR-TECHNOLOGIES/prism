import { useState, useEffect } from 'react';
import { Goal, GoalStatus, GoalTimeframe } from '@/types/goal';
import { Category } from '@/types/task';
import { goalStore } from '@/lib/goalStore';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setGoals(goalStore.getAllGoals());

    const unsubscribe = goalStore.subscribe(() => {
      setGoals(goalStore.getAllGoals());
    });

    return unsubscribe;
  }, []);

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    return goalStore.addGoal(goal);
  };

  const updateGoal = (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => {
    return goalStore.updateGoal(id, updates);
  };

  const deleteGoal = (id: string) => {
    return goalStore.deleteGoal(id);
  };

  const getGoalsByTimeframe = (timeframe: GoalTimeframe) => {
    return goalStore.getGoalsByTimeframe(timeframe);
  };

  const getGoalsByCategory = (category: Category) => {
    return goalStore.getGoalsByCategory(category);
  };

  const getGoalsByStatus = (status: GoalStatus) => {
    return goalStore.getGoalsByStatus(status);
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalsByTimeframe,
    getGoalsByCategory,
    getGoalsByStatus,
  };
}
