import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Calendar as CalendarIcon, Target, TrendingUp } from 'lucide-react';
import { format, eachDayOfInterval, startOfDay, isSameDay } from 'date-fns';
import { Routine } from '@/types/routine';
import { useRoutines } from '@/hooks/useRoutines';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { AddSubTargetForm } from '@/components/routines/add-subtarget-form';
import { EditSubTargetForm } from '@/components/routines/edit-subtarget-form';
import { SubTarget } from '@/types/routine';
import { useToast } from '@/hooks/use-toast';

interface RoutineDetailProps {
  routine: Routine;
  onBack: () => void;
}

export function RoutineDetail({ routine, onBack }: RoutineDetailProps) {
  const { updateDailyProgress, getDailyProgress, getRoutineStats, deleteSubTarget } = useRoutines();
  const { toast } = useToast();
  const [showAddSubTarget, setShowAddSubTarget] = useState(false);
  const [editingSubTarget, setEditingSubTarget] = useState<SubTarget | null>(null);

  const stats = getRoutineStats(routine.id);
  const today = startOfDay(new Date());
  const isActive = today >= routine.startDate && today <= routine.endDate;
  
  // Get all days in the routine period
  const allDays = eachDayOfInterval({
    start: routine.startDate,
    end: routine.endDate
  });

  // Get last 7 days or routine days if shorter
  const recentDays = allDays.slice(-7);

  const handleProgressToggle = (subTargetId: string, date: Date) => {
    const currentValue = getDailyProgress(routine.id, subTargetId, date);
    updateDailyProgress(routine.id, subTargetId, date, !currentValue);
  };

  const handleDeleteSubTarget = (subTarget: SubTarget) => {
    if (window.confirm(`Are you sure you want to delete "${subTarget.name}"? This will remove all progress data.`)) {
      deleteSubTarget(routine.id, subTarget.id);
      toast({
        title: 'Sub-target deleted',
        description: `"${subTarget.name}" has been removed from the routine.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{routine.title}</h1>
            {isActive && (
              <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                Active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {format(routine.startDate, 'MMM d')} - {format(routine.endDate, 'MMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {routine.subTargets.length} habits
            </span>
          </div>
          {routine.description && (
            <p className="text-muted-foreground mt-2">{routine.description}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-2xl font-bold">{Math.round(stats.overallProgress)}%</span>
              </div>
              <Progress value={stats.overallProgress} className="mt-2" />
            </CardContent>
          </Card>
          
          {isActive && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(stats.dailyCompletionRate)}%</div>
                <p className="text-xs text-muted-foreground">
                  {routine.subTargets.filter(st => getDailyProgress(routine.id, st.id, today)).length} of {stats.totalSubTargets} completed
                </p>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDays}</div>
              <p className="text-xs text-muted-foreground">days total</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sub-targets and tracking */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Daily Habits</h2>
          <Button onClick={() => setShowAddSubTarget(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Habit
          </Button>
        </div>

        {showAddSubTarget && (
          <AddSubTargetForm 
            routineId={routine.id} 
            onClose={() => setShowAddSubTarget(false)} 
          />
        )}

        {editingSubTarget && (
          <EditSubTargetForm
            routineId={routine.id}
            subTarget={editingSubTarget}
            onClose={() => setEditingSubTarget(null)}
          />
        )}

        {routine.subTargets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-8 w-8 text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-1">No habits yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Add your first daily habit to start tracking.</p>
              <Button onClick={() => setShowAddSubTarget(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {routine.subTargets.map((subTarget) => (
              <Card key={subTarget.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{subTarget.name}</CardTitle>
                      {subTarget.description && (
                        <CardDescription className="mt-1">
                          {subTarget.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingSubTarget(subTarget)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteSubTarget(subTarget)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Recent days tracker */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Recent Progress</h4>
                    <div className="grid grid-cols-7 gap-2">
                      {recentDays.map((day) => {
                        const isCompleted = getDailyProgress(routine.id, subTarget.id, day);
                        const isPastDay = day < today;
                        const isToday = isSameDay(day, today);
                        const isFutureDay = day > today;
                        
                        return (
                          <div key={day.toISOString()} className="flex flex-col items-center gap-1">
                            <div className="text-xs text-muted-foreground">
                              {format(day, 'EEE')}
                            </div>
                            <div className="text-xs font-medium">
                              {format(day, 'd')}
                            </div>
                            <Checkbox
                              checked={isCompleted}
                              disabled={isFutureDay}
                              onCheckedChange={() => handleProgressToggle(subTarget.id, day)}
                              className={`
                                ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                                ${isPastDay && !isCompleted ? 'opacity-60' : ''}
                              `}
                            />
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Progress for this sub-target */}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span>
                          {routine.dailyProgress.filter(dp => 
                            dp.subTargetId === subTarget.id && dp.completed
                          ).length} / {allDays.length} days
                        </span>
                      </div>
                      <Progress 
                        value={(routine.dailyProgress.filter(dp => 
                          dp.subTargetId === subTarget.id && dp.completed
                        ).length / allDays.length) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}