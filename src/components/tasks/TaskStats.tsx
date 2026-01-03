import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, AlertTriangle, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TaskStats: React.FC = () => {
  const { getTaskStats } = useTasks();
  const stats = getTaskStats();
  
  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  const statItems = [
    { 
      label: 'Total', 
      value: stats.total, 
      icon: ListTodo, 
      color: 'text-foreground',
      bg: 'bg-muted'
    },
    { 
      label: 'Pending', 
      value: stats.pending, 
      icon: Circle, 
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    { 
      label: 'Completed', 
      value: stats.completed, 
      icon: CheckCircle2, 
      color: 'text-success',
      bg: 'bg-success/10'
    },
    { 
      label: 'Overdue', 
      value: stats.overdue, 
      icon: AlertTriangle, 
      color: 'text-destructive',
      bg: 'bg-destructive/10'
    },
  ];

  return (
    <Card className="p-4 border-border/50">
      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {statItems.map((item) => (
          <div 
            key={item.label}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl transition-colors",
              item.bg
            )}
          >
            <item.icon className={cn("w-4 h-4 mb-1.5", item.color)} />
            <span className="text-xl font-bold text-foreground">{item.value}</span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Completion Rate</span>
          <span className="font-medium text-foreground">{completionRate}%</span>
        </div>
        <Progress value={completionRate} className="h-2" />
      </div>
    </Card>
  );
};
