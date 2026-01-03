import React from 'react';
import { Task, CATEGORY_CONFIG, PRIORITY_CONFIG } from '@/types/task';
import { useTasks } from '@/contexts/TaskContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle2 
} from 'lucide-react';
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { toggleComplete, deleteTask } = useTasks();
  
  const isOverdue = !task.completed && isPast(task.deadline);
  const deadlineLabel = getDeadlineLabel(task.deadline);
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const categoryConfig = CATEGORY_CONFIG[task.category];

  return (
    <Card 
      className={cn(
        "group p-4 transition-all duration-300 hover:shadow-md border-l-4 animate-scale-in cursor-pointer",
        task.completed && "opacity-60 bg-muted/30",
        isOverdue && !task.completed && "border-l-destructive bg-destructive/5",
        !isOverdue && !task.completed && {
          'border-l-priority-high': task.priority === 'high',
          'border-l-priority-medium': task.priority === 'medium',
          'border-l-priority-low': task.priority === 'low',
        }
      )}
      onClick={() => onEdit?.(task)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div 
          className="pt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleComplete(task.id)}
            className={cn(
              "h-5 w-5 rounded-full transition-all duration-200",
              task.completed && "bg-success border-success data-[state=checked]:bg-success"
            )}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and badges */}
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-medium text-foreground transition-all",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Priority badge */}
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs capitalize",
                  task.priority === 'high' && "bg-priority-high/10 text-priority-high",
                  task.priority === 'medium' && "bg-priority-medium/10 text-priority-medium",
                  task.priority === 'low' && "bg-priority-low/10 text-priority-low"
                )}
              >
                {task.priority}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className={cn(
              "text-sm text-muted-foreground mt-1 line-clamp-2",
              task.completed && "line-through"
            )}>
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
            {/* Category */}
            <span className="flex items-center gap-1">
              <span>{categoryConfig.emoji}</span>
              <span>{categoryConfig.label}</span>
            </span>

            {/* Deadline */}
            <span className={cn(
              "flex items-center gap-1",
              isOverdue && !task.completed && "text-destructive font-medium"
            )}>
              {isOverdue && !task.completed ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                <Calendar className="w-3 h-3" />
              )}
              <span>{deadlineLabel}</span>
            </span>

            {/* Time */}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{format(task.deadline, 'h:mm a')}</span>
            </span>

            {/* Completed indicator */}
            {task.completed && task.completedAt && (
              <span className="flex items-center gap-1 text-success">
                <CheckCircle2 className="w-3 h-3" />
                <span>Completed {formatDistanceToNow(task.completedAt, { addSuffix: true })}</span>
              </span>
            )}
          </div>
        </div>

        {/* Delete button */}
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

// Helper function to format deadline in a friendly way
function getDeadlineLabel(deadline: Date): string {
  if (isToday(deadline)) {
    return 'Today';
  }
  if (isTomorrow(deadline)) {
    return 'Tomorrow';
  }
  if (isPast(deadline)) {
    return `Overdue (${format(deadline, 'MMM d')})`;
  }
  return format(deadline, 'MMM d, yyyy');
}
