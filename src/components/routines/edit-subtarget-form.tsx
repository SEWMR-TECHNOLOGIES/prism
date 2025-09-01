import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useRoutines } from '@/hooks/useRoutines';
import { SubTarget } from '@/types/routine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditSubTargetFormProps {
  routineId: string;
  subTarget: SubTarget;
  onClose: () => void;
}

export function EditSubTargetForm({ routineId, subTarget, onClose }: EditSubTargetFormProps) {
  const { updateSubTarget } = useRoutines();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subTarget.name,
      description: subTarget.description || '',
    },
  });

  const onSubmit = (data: FormData) => {
    try {
      updateSubTarget(routineId, subTarget.id, data);
      toast({
        title: 'Habit updated',
        description: 'Your habit has been updated successfully.',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update habit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Edit Habit</CardTitle>
          <CardDescription>
            Update the details of this habit
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Drink 1.5L Water, Morning Workout..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional details about this habit..."
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Update Habit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}