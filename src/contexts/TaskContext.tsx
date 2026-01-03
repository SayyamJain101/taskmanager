import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, Priority, Category, SortOption, FilterOption, PRIORITY_WEIGHTS } from '@/types/task';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  sortOption: SortOption;
  filterOption: FilterOption;
  categoryFilter: Category | 'all';
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  setSortOption: (option: SortOption) => void;
  setFilterOption: (option: FilterOption) => void;
  setCategoryFilter: (category: Category | 'all') => void;
  getTaskStats: () => { total: number; completed: number; pending: number; overdue: number };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Storage key generator per user
const getStorageKey = (userId: string) => `taskflow_tasks_${userId}`;

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('deadline');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  // Load tasks when user changes
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(getStorageKey(user.id));
      if (stored) {
        const parsed = JSON.parse(stored).map((t: Task) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          deadline: new Date(t.deadline),
          completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
        }));
        setTasks(parsed);
      } else {
        setTasks([]);
      }
    } else {
      setTasks([]);
    }
  }, [user]);

  // Save tasks whenever they change
  useEffect(() => {
    if (user && tasks.length >= 0) {
      localStorage.setItem(getStorageKey(user.id), JSON.stringify(tasks));
    }
  }, [tasks, user]);

  // Smart sorting algorithm combining deadline, priority, and time
  const sortTasks = useCallback((tasksToSort: Task[], option: SortOption): Task[] => {
    return [...tasksToSort].sort((a, b) => {
      // Completed tasks always go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      switch (option) {
        case 'deadline':
          // Smart sort: combine deadline urgency with priority
          const now = new Date().getTime();
          const aUrgency = (a.deadline.getTime() - now) / (1000 * 60 * 60); // hours until deadline
          const bUrgency = (b.deadline.getTime() - now) / (1000 * 60 * 60);
          
          // Apply priority weight to urgency
          const aScore = aUrgency / PRIORITY_WEIGHTS[a.priority];
          const bScore = bUrgency / PRIORITY_WEIGHTS[b.priority];
          
          return aScore - bScore;
          
        case 'priority':
          return PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
          
        case 'createdAt':
          return b.createdAt.getTime() - a.createdAt.getTime();
          
        case 'title':
          return a.title.localeCompare(b.title);
          
        default:
          return 0;
      }
    });
  }, []);

  // Filter and sort tasks
  const filteredTasks = React.useMemo(() => {
    let result = [...tasks];

    // Apply status filter
    switch (filterOption) {
      case 'active':
        result = result.filter(t => !t.completed);
        break;
      case 'completed':
        result = result.filter(t => t.completed);
        break;
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }

    // Apply sorting
    return sortTasks(result, sortOption);
  }, [tasks, filterOption, categoryFilter, sortOption, sortTasks]);

  // Add new task
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      completed: false,
    };
    
    setTasks(prev => [...prev, newTask]);
    
    toast({
      title: "Task added",
      description: `"${taskData.title}" has been added to your list.`,
    });
  }, []);

  // Update existing task
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
    
    toast({
      title: "Task updated",
      description: "Your changes have been saved.",
    });
  }, []);

  // Delete task
  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === id);
      if (task) {
        toast({
          title: "Task deleted",
          description: `"${task.title}" has been removed.`,
        });
      }
      return prev.filter(t => t.id !== id);
    });
  }, []);

  // Toggle task completion
  const toggleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const completed = !task.completed;
        return {
          ...task,
          completed,
          completedAt: completed ? new Date() : undefined,
        };
      }
      return task;
    }));
  }, []);

  // Get task statistics
  const getTaskStats = useCallback(() => {
    const now = new Date();
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      overdue: tasks.filter(t => !t.completed && t.deadline < now).length,
    };
  }, [tasks]);

  return (
    <TaskContext.Provider value={{
      tasks,
      filteredTasks,
      sortOption,
      filterOption,
      categoryFilter,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      setSortOption,
      setFilterOption,
      setCategoryFilter,
      getTaskStats,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use task context
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
