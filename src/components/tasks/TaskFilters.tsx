import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { Category, CATEGORY_CONFIG, FilterOption, SortOption } from '@/types/task';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowDownAZ, 
  CalendarDays, 
  Clock, 
  Flag,
  Filter,
  CheckCircle2,
  Circle,
  ListTodo
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'deadline', label: 'Smart Sort', icon: <CalendarDays className="w-4 h-4" /> },
  { value: 'priority', label: 'Priority', icon: <Flag className="w-4 h-4" /> },
  { value: 'createdAt', label: 'Date Added', icon: <Clock className="w-4 h-4" /> },
  { value: 'title', label: 'Alphabetical', icon: <ArrowDownAZ className="w-4 h-4" /> },
];

const FILTER_OPTIONS: { value: FilterOption; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All Tasks', icon: <ListTodo className="w-4 h-4" /> },
  { value: 'active', label: 'Active', icon: <Circle className="w-4 h-4" /> },
  { value: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" /> },
];

export const TaskFilters: React.FC = () => {
  const { 
    sortOption, 
    filterOption, 
    categoryFilter,
    setSortOption, 
    setFilterOption,
    setCategoryFilter 
  } = useTasks();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-card rounded-xl border border-border/50">
      {/* Status filter buttons */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
        {FILTER_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={filterOption === option.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilterOption(option.value)}
            className={cn(
              "h-8 px-3 text-xs transition-all",
              filterOption === option.value && "shadow-sm"
            )}
          >
            {option.icon}
            <span className="ml-1.5 hidden sm:inline">{option.label}</span>
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Category filter */}
        <Select
          value={categoryFilter}
          onValueChange={(value: Category | 'all') => setCategoryFilter(value)}
        >
          <SelectTrigger className="w-[140px] h-9 text-xs">
            <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {(Object.keys(CATEGORY_CONFIG) as Category[]).map((category) => (
              <SelectItem key={category} value={category}>
                <span className="flex items-center gap-2">
                  <span>{CATEGORY_CONFIG[category].emoji}</span>
                  {CATEGORY_CONFIG[category].label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort option */}
        <Select
          value={sortOption}
          onValueChange={(value: SortOption) => setSortOption(value)}
        >
          <SelectTrigger className="w-[140px] h-9 text-xs">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
