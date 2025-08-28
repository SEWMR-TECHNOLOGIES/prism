import { useState, useEffect } from 'react';
import { Goal, goalStore } from '@/lib/goalStore';

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

  const getGoalsByTimeframe = (timeframe: 'weekly' | 'monthly') => {
    return goalStore.getGoalsByTimeframe(timeframe);
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalsByTimeframe
  };
}