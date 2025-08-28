import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Goal } from '@/lib/goalStore';

interface AddGoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Goal;
}

export function AddGoalForm({ open, onOpenChange, onSubmit, initialData }: AddGoalFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [target, setTarget] = useState(initialData?.target || 10);
  const [current, setCurrent] = useState(initialData?.current || 0);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>(initialData?.timeframe || 'weekly');
  const [category, setCategory] = useState(initialData?.category || 'work');
  const [color, setColor] = useState(initialData?.color || 'blue');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const goalData = {
      title: title.trim(),
      target,
      current,
      timeframe,
      category,
      color
    };

    onSubmit(goalData);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    if (!initialData) {
      setTitle('');
      setTarget(10);
      setCurrent(0);
      setTimeframe('weekly');
      setCategory('work');
      setColor('blue');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="modern-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {initialData ? 'Edit Goal' : 'Add New Goal'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-foreground">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter goal title"
              className="modern-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current" className="text-sm font-medium text-foreground">
              Current Progress
            </Label>
            <Input
              id="current"
              type="number"
              min="0"
              value={current}
              onChange={(e) => setCurrent(Number(e.target.value))}
              placeholder="Current progress"
              className="modern-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target" className="text-sm font-medium text-foreground">
                Target
              </Label>
              <Input
                id="target"
                type="number"
                min="1"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="modern-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe" className="text-sm font-medium text-foreground">
                Timeframe
              </Label>
               <Select value={timeframe} onValueChange={(value: 'weekly' | 'monthly') => setTimeframe(value)}>
                <SelectTrigger className="modern-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-foreground">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="modern-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm font-medium text-foreground">
                Color
              </Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="modern-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="modern-btn-secondary"
            >
              Cancel
            </Button>
            <Button type="submit" className="modern-btn-primary">
              {initialData ? 'Update Goal' : 'Add Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}