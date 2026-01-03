import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { FloatingAddButton } from '@/components/layout/FloatingAddButton';
import { TaskStats } from '@/components/tasks/TaskStats';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Task } from '@/types/task';
import { usePWA } from '@/hooks/usePWA';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { canInstall, install } = usePWA();

  const handleAddTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingTask(null);
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header canInstall={canInstall} onInstallClick={install} />
      
      <main className="container py-6 space-y-6">
        {/* Greeting */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Stats */}
        <TaskStats />

        {/* Filters */}
        <TaskFilters />

        {/* Task list */}
        <TaskList onEditTask={handleEditTask} />
      </main>

      {/* Floating add button */}
      <FloatingAddButton onClick={handleAddTask} />

      {/* Task form dialog */}
      <TaskForm 
        open={isFormOpen} 
        onOpenChange={handleFormClose}
        editTask={editingTask}
      />
    </div>
  );
};

export default Dashboard;
