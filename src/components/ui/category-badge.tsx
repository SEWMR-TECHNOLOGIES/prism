import { Category } from '@/types/task';
import { cn } from '@/lib/utils';
import { Briefcase, User, Heart, DollarSign, Hash } from 'lucide-react';

const categoryStyles: Record<Category, string> = {
  work: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  personal: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  health: 'bg-green-500/20 text-green-400 border-green-500/50',
  finance: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  other: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
};

const categoryIcons: Record<Category, React.ComponentType<{ className?: string }>> = {
  work: Briefcase,
  personal: User,
  health: Heart,
  finance: DollarSign,
  other: Hash
};

const categoryLabels: Record<Category, string> = {
  work: 'Work',
  personal: 'Personal',
  health: 'Health',
  finance: 'Finance',
  other: 'Other'
};

interface CategoryBadgeProps {
  category: Category;
  showIcon?: boolean;
  className?: string;
}

export function CategoryBadge({ category, showIcon = true, className }: CategoryBadgeProps) {
  const Icon = categoryIcons[category];
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
      categoryStyles[category],
      className
    )}>
      {showIcon && <Icon className="w-3 h-3" />}
      {categoryLabels[category]}
    </span>
  );
}