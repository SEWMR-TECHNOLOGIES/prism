import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/hooks/useTasks';
import { useGoals } from '@/hooks/useGoals';
import { AddGoalForm } from '@/components/goals/add-goal-form';
import { Target, Plus, TrendingUp, Calendar, CheckCircle2, Edit, Trash2 } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Goal } from '@/lib/goalStore';

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, getGoalsByTimeframe } = useGoals();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { tasks } = useTasks();
  const { toast } = useToast();

  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const getCompletedTasksForGoal = (goal: Goal) => {
    const dateRange = goal.timeframe === 'weekly' 
      ? { start: weekStart, end: weekEnd }
      : { start: monthStart, end: monthEnd };

    return tasks.filter(task => 
      task.status === 'completed' &&
      task.category === goal.category &&
      task.completedAt &&
      isWithinInterval(new Date(task.completedAt), dateRange)
    ).length;
  };

  const getProgressPercentage = (goal: Goal) => {
    const completed = getCompletedTasksForGoal(goal);
    return Math.min((completed / goal.target) * 100, 100);
  };

  const getGoalStatus = (goal: Goal) => {
    const completed = getCompletedTasksForGoal(goal);
    if (completed >= goal.target) return 'completed';
    if (completed >= goal.target * 0.7) return 'on-track';
    return 'behind';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'on-track': return 'text-blue-500';
      case 'behind': return 'text-orange-500';
      default: return 'text-muted-foreground';
    }
  };

  const handleAddGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    addGoal(goalData);
    setShowAddForm(false);
    toast({
      title: "Goal added",
      description: `"${goalData.title}" has been added successfully.`
    });
  };

  const handleEditGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingGoal) return;
    updateGoal(editingGoal.id, goalData);
    setEditingGoal(null);
    toast({
      title: "Goal updated",
      description: `"${goalData.title}" has been updated successfully.`
    });
  };

  const handleDeleteGoal = (id: string) => {
    const goal = goals.find(g => g.id === id);
    deleteGoal(id);
    if (goal) {
      toast({
        title: "Goal deleted",
        description: `"${goal.title}" has been deleted.`,
        variant: "destructive"
      });
    }
  };

  const weeklyGoals = getGoalsByTimeframe('weekly');
  const monthlyGoals = getGoalsByTimeframe('monthly');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Goals</h1>
          <p className="text-muted-foreground">Track your progress and achieve your targets</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="modern-btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{goals.length}</div>
            <div className="text-xs text-muted-foreground">Active Goals</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {goals.filter(g => getGoalStatus(g) === 'completed').length}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {goals.filter(g => getGoalStatus(g) === 'on-track').length}
            </div>
            <div className="text-xs text-muted-foreground">On Track</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {goals.filter(g => getGoalStatus(g) === 'behind').length}
            </div>
            <div className="text-xs text-muted-foreground">Behind</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Weekly Goals ({format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd')})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weeklyGoals.map((goal) => {
            const completed = getCompletedTasksForGoal(goal);
            const progress = getProgressPercentage(goal);
            const status = getGoalStatus(goal);
            
            return (
              <Card key={goal.id} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">{goal.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(status)}>
                        {status.replace('-', ' ')}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingGoal(goal)}
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                   <p className="text-sm text-muted-foreground">Category: {goal.category}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">
                        {completed} / {goal.target} tasks
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-right text-xs text-muted-foreground">
                      {progress.toFixed(0)}% complete
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Monthly Goals */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Monthly Goals ({format(monthStart, 'MMM yyyy')})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthlyGoals.map((goal) => {
            const completed = getCompletedTasksForGoal(goal);
            const progress = getProgressPercentage(goal);
            const status = getGoalStatus(goal);
            
            return (
              <Card key={goal.id} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">{goal.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(status)}>
                        {status.replace('-', ' ')}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingGoal(goal)}
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Category: {goal.category}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">
                        {completed} / {goal.target} tasks
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-right text-xs text-muted-foreground">
                      {progress.toFixed(0)}% complete
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <AddGoalForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onSubmit={handleAddGoal}
      />

      <AddGoalForm
        open={!!editingGoal}
        onOpenChange={(open) => !open && setEditingGoal(null)}
        onSubmit={handleEditGoal}
        initialData={editingGoal || undefined}
      />
    </div>
  );
}