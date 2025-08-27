import { useState, useEffect } from 'react';
import { Goal, GoalTimeframe } from '@/types/goal';
import { Category } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AddGoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<Goal>;
}

export function AddGoalForm({ open, onOpenChange, onSubmit, initialData }: AddGoalFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [target, setTarget] = useState<number>(initialData?.target ?? 1);
  const [timeframe, setTimeframe] = useState<GoalTimeframe>(initialData?.timeframe || 'monthly');
  const [category, setCategory] = useState<Category>(initialData?.category || 'personal');
  const [color, setColor] = useState(initialData?.color || '#2563eb');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setTarget(initialData.target ?? 1);
      setTimeframe(initialData.timeframe || 'monthly');
      setCategory(initialData.category || 'personal');
      setColor(initialData.color || '#2563eb');
    }
  }, [initialData]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTarget(1);
    setTimeframe('monthly');
    setCategory('personal');
    setColor('#2563eb');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!Number.isFinite(target) || target <= 0) return;

    const goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      target,
      timeframe,
      category,
      color,
    };

    onSubmit(goalData);

    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update your goal details below.'
              : 'Create a new goal to track progress over time.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">Title *</Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter goal title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-description">Description</Label>
            <Textarea
              id="goal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the goal (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal-target">Target *</Label>
              <Input
                id="goal-target"
                type="number"
                min={1}
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                placeholder="Number of tasks"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select value={timeframe} onValueChange={(v) => setTimeframe(v as GoalTimeframe)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-color">Color</Label>
              <Input
                id="goal-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 p-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !(Number.isFinite(target) && target > 0)}>
              {initialData ? 'Update Goal' : 'Add Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
