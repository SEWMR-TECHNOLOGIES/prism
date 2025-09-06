import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Calendar as CalendarIcon, Target, TrendingUp, BarChart3 } from 'lucide-react';
import { format, eachDayOfInterval, startOfDay, isSameDay } from 'date-fns';
import { Routine } from '@/types/routine';
import { useRoutines } from '@/hooks/useRoutines';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddSubTargetForm } from '@/components/routines/add-subtarget-form';
import { EditSubTargetForm } from '@/components/routines/edit-subtarget-form';
import { RoutineSummary } from '@/components/routines/routine-summary';
import { SubTarget } from '@/types/routine';
import { useToast } from '@/hooks/use-toast';
import DayCheckbox from '../ui/day-check';

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

  // Get all days within the routine's duration
  const allDays = eachDayOfInterval({
    start: routine.startDate,
    end: routine.endDate
  });

  // Find today's position in the array
  const todayIndex = allDays.findIndex((d) => isSameDay(d, today));

  // Calculate window range → 3 past, today, 3 future
  const startIndex = Math.max(0, todayIndex - 3);
  const endIndex = Math.min(allDays.length, todayIndex + 4);

  const visibleDays = allDays.slice(startIndex, endIndex);

  const handleProgressToggle = (subTargetId: string, date: Date) => {
    if (!isSameDay(date, today)) return; // ✅ Only today's checkbox can be toggled
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="space-y-2">
                  <div className="text-2xl font-bold flex items-center gap-2">
                    {Math.round(stats.dailyCompletionRate)}%
                    {stats.dailyCompletionRate >= 80 && <span>🟢</span>}
                    {stats.dailyCompletionRate >= 50 && stats.dailyCompletionRate < 80 && <span>🟡</span>}
                    {stats.dailyCompletionRate < 50 && <span>🔴</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {routine.subTargets.filter(st => getDailyProgress(routine.id, st.id, today)).length} of {stats.totalSubTargets} completed
                  </p>
                  <Progress value={stats.dailyCompletionRate} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-1">
                {stats.currentStreak}
                {stats.currentStreak > 0 && <span>🔥</span>}
              </div>
              <p className="text-xs text-muted-foreground">
                Best: {stats.longestStreak} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Success Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{Math.round(stats.successScore)}</div>
                <div className="text-xs">
                  {stats.successScore >= 90 && <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">🥇 Elite</Badge>}
                  {stats.successScore >= 75 && stats.successScore < 90 && <Badge variant="secondary" className="bg-slate-500/10 text-slate-600">🥈 Consistent</Badge>}
                  {stats.successScore >= 50 && stats.successScore < 75 && <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">🥉 Improving</Badge>}
                  {stats.successScore < 50 && <Badge variant="secondary" className="bg-red-500/10 text-red-600">🔴 Struggling</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs for tracking and summary */}
      <Tabs defaultValue="tracking" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tracking">Daily Tracking</TabsTrigger>
          <TabsTrigger value="summary">
            <BarChart3 className="mr-2 h-4 w-4" />
            Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-4">
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
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Recent Progress</h4>
                      <div className="grid grid-cols-7 gap-2">
                        {visibleDays.map((day) => {
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
                              <DayCheckbox
                                id={subTarget.id}
                                day={new Date(day)}       // make sure day is a Date object
                                isCompleted={isCompleted}
                                isFutureDay={isFutureDay}
                                isToday={isToday}
                                isPastDay={isPastDay}
                                onToggle={(id, day) => handleProgressToggle(id, day)}
                              />

                            </div>
                          );
                        })}
                      </div>

                      {/* Sub-target completion rate */}
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
        </TabsContent>

        <TabsContent value="summary">
          <RoutineSummary routine={routine} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
