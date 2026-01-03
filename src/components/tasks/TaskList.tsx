import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { TaskCard } from './TaskCard';
import { Task } from '@/types/task';
import { ClipboardList, CheckCircle2, Sparkles } from 'lucide-react';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const { filteredTasks, filterOption } = useTasks();

  // Empty state
  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-muted flex items-center justify-center">
          {filterOption === 'completed' ? (
            <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
          ) : (
            <ClipboardList className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {filterOption === 'completed' 
            ? 'No completed tasks yet' 
            : filterOption === 'active'
            ? 'All caught up!'
            : 'No tasks yet'}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {filterOption === 'completed'
            ? 'Complete some tasks and they will appear here.'
            : filterOption === 'active'
            ? 'Great job! Add more tasks to keep the momentum going.'
            : 'Get started by adding your first task. Stay organized and productive!'}
        </p>
        {filterOption !== 'completed' && (
          <div className="flex items-center gap-1.5 mt-4 text-xs text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Click the + button to add a task</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task, index) => (
        <div 
          key={task.id} 
          style={{ animationDelay: `${index * 50}ms` }}
          className="animate-slide-up"
        >
          <TaskCard task={task} onEdit={onEditTask} />
        </div>
      ))}
    </div>
  );
};
