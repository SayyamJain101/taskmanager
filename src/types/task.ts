// Task type definitions for the To-Do application

export type Priority = 'high' | 'medium' | 'low';

export type Category = 'work' | 'personal' | 'shopping' | 'health' | 'other';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  createdAt: Date;
  deadline: Date;
  completed: boolean;
  completedAt?: Date;
}

export type SortOption = 'deadline' | 'priority' | 'createdAt' | 'title';

export type FilterOption = 'all' | 'active' | 'completed';

// Priority weight for sorting algorithm
export const PRIORITY_WEIGHTS: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

// Category display names and colors
export const CATEGORY_CONFIG: Record<Category, { label: string; emoji: string }> = {
  work: { label: 'Work', emoji: '💼' },
  personal: { label: 'Personal', emoji: '🏠' },
  shopping: { label: 'Shopping', emoji: '🛒' },
  health: { label: 'Health', emoji: '💪' },
  other: { label: 'Other', emoji: '📌' },
};

// Priority display configuration
export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  high: { label: 'High', color: 'priority-high' },
  medium: { label: 'Medium', color: 'priority-medium' },
  low: { label: 'Low', color: 'priority-low' },
};
