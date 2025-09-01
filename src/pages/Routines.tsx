import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Target, TrendingUp } from 'lucide-react';
import { useRoutines } from '@/hooks/useRoutines';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AddRoutineForm } from '@/components/routines/add-routine-form';
import { RoutineDetail } from '@/components/routines/routine-detail';
import { format, differenceInDays } from 'date-fns';

export default function Routines() {
  const { routines, getRoutineStats } = useRoutines();
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const selectedRoutine = selectedRoutineId ? routines.find(r => r.id === selectedRoutineId) : null;

  if (selectedRoutine) {
    return (
      <RoutineDetail 
        routine={selectedRoutine} 
        onBack={() => setSelectedRoutineId(null)} 
      />
    );
  }

  return (
    <div className="space-y-8 pt-4 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Routines</h1>
          <p className="text-muted-foreground">
            Track daily habits and build consistent routines
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Routine
        </Button>
      </div>

      {showAddForm && (
        <AddRoutineForm onClose={() => setShowAddForm(false)} />
      )}

      {routines.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No routines yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first routine to start tracking daily habits and building consistency.
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Routine
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {routines.map((routine) => {
            const stats = getRoutineStats(routine.id);
            const duration = differenceInDays(routine.endDate, routine.startDate) + 1;
            const isActive = new Date() >= routine.startDate && new Date() <= routine.endDate;
            
            return (
              <Card 
                key={routine.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedRoutineId(routine.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {routine.title}
                        {isActive && (
                          <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                            Active
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {routine.description && (
                          <span className="block mb-1">{routine.description}</span>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(routine.startDate, 'MMM d')} - {format(routine.endDate, 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {routine.subTargets.length} habits
                          </span>
                          <span>{duration} days</span>
                        </div>
                      </CardDescription>
                    </div>
                    {stats && (
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{Math.round(stats.overallProgress)}%</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                {stats && (
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{Math.round(stats.overallProgress)}%</span>
                      </div>
                      <Progress value={stats.overallProgress} className="h-2" />
                      
                      {isActive && (
                        <div className="flex justify-between text-sm pt-2 border-t">
                          <span>Today's Completion</span>
                          <span className="font-medium">
                            {Math.round(stats.dailyCompletionRate)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}