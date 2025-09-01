import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, TrendingUp, Target, Award, Flame } from 'lucide-react';
import { Routine } from '@/types/routine';
import { useRoutines } from '@/hooks/useRoutines';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { format, eachDayOfInterval, startOfDay, isSameDay } from 'date-fns';

interface RoutineSummaryProps {
  routine: Routine;
}

export function RoutineSummary({ routine }: RoutineSummaryProps) {
  const { getRoutineStats, getSubTargetStats, getDailyProgress } = useRoutines();
  
  const stats = getRoutineStats(routine.id);
  if (!stats) return null;

  const getSuccessLabel = (score: number) => {
    if (score >= 90) return { label: '🥇 Elite', color: 'bg-yellow-500/10 text-yellow-600' };
    if (score >= 75) return { label: '🥈 Consistent', color: 'bg-slate-500/10 text-slate-600' };
    if (score >= 50) return { label: '🥉 Improving', color: 'bg-amber-500/10 text-amber-600' };
    return { label: '🔴 Struggling', color: 'bg-red-500/10 text-red-600' };
  };

  const successLabel = getSuccessLabel(stats.successScore);

  // Sub-target performance data
  const subTargetData = routine.subTargets.map(subTarget => {
    const subStats = getSubTargetStats(routine.id, subTarget.id);
    return {
      name: subTarget.name,
      successRate: subStats?.successRate || 0,
      bestStreak: subStats?.bestStreak || 0,
      completedDays: subStats?.completedDays || 0,
      totalDays: subStats?.totalDays || 0
    };
  });

  // Calendar data for visual insights
  const allDays = eachDayOfInterval({
    start: routine.startDate,
    end: routine.endDate
  });

  const today = startOfDay(new Date());
  const calendarData = allDays.filter(day => day <= today).map(day => {
    const completedCount = routine.subTargets.filter(st => 
      getDailyProgress(routine.id, st.id, day)
    ).length;
    const totalSubTargets = routine.subTargets.length;
    const percentage = totalSubTargets > 0 ? (completedCount / totalSubTargets) * 100 : 0;
    
    let status = '🔴';
    if (percentage === 100) status = '🟢';
    else if (percentage >= 50) status = '🟡';
    
    return {
      date: day,
      percentage,
      status,
      completedCount,
      totalSubTargets
    };
  });

  const getSubTargetStatus = (successRate: number) => {
    if (successRate >= 80) return { label: '🟢 Excellent', color: 'text-green-600' };
    if (successRate >= 60) return { label: '🟡 Good', color: 'text-yellow-600' };
    if (successRate >= 40) return { label: '🟡 Average', color: 'text-yellow-600' };
    return { label: '🔴 Needs Work', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Success Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">{Math.round(stats.successScore)}</div>
              <Badge variant="secondary" className={successLabel.color}>
                {successLabel.label}
              </Badge>
              <Progress value={stats.successScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">{Math.round(stats.overallProgress)}%</div>
              <p className="text-xs text-muted-foreground">
                {routine.dailyProgress.filter(dp => dp.completed).length} / {stats.totalSubTargets * stats.totalDays} checks
              </p>
              <Progress value={stats.overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold flex items-center gap-1">
                {stats.currentStreak}
                {stats.currentStreak > 0 && <Flame className="h-6 w-6 text-orange-500" />}
              </div>
              <p className="text-xs text-muted-foreground">
                Best: {stats.longestStreak} days
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Daily Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">{Math.round(stats.averageDailySuccess)}%</div>
              <p className="text-xs text-muted-foreground">
                Average completion rate
              </p>
              <Progress value={stats.averageDailySuccess} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-Target Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Sub-Target Performance</CardTitle>
          <CardDescription>
            Individual performance breakdown for each habit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Performance Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subTargetData}>
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Bar dataKey="successRate" radius={[4, 4, 0, 0]}>
                    {subTargetData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.successRate >= 80 ? 'hsl(var(--success))' :
                          entry.successRate >= 60 ? 'hsl(var(--warning))' :
                          'hsl(var(--destructive))'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Table */}
            <div className="space-y-3">
              <h4 className="font-medium">Detailed Breakdown</h4>
              <div className="space-y-2">
                {subTargetData.map((data, index) => {
                  const status = getSubTargetStatus(data.successRate);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium truncate">{data.name}</h5>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Success: {Math.round(data.successRate)}%</span>
                          <span>Best Streak: {data.bestStreak} days</span>
                          <span>{data.completedDays}/{data.totalDays} days</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className={status.color}>
                        {status.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Progress Overview
          </CardTitle>
          <CardDescription>
            Visual overview of your daily performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Perfect Day (100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Partial Success (50-99%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Missed Day (&lt;50%)</span>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {calendarData.slice(-21).map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-1 p-2 rounded">
                  <div className="text-xs font-medium">
                    {format(day.date, 'EEE')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(day.date, 'd')}
                  </div>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      day.percentage === 100 ? 'bg-green-500 text-white' :
                      day.percentage >= 50 ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}
                    title={`${day.completedCount}/${day.totalSubTargets} completed`}
                  >
                    {Math.round(day.percentage)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}