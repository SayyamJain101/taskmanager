import React, { useState, useEffect } from 'react';
import { Task, Priority, Category, CATEGORY_CONFIG, PRIORITY_CONFIG } from '@/types/task';
import { useTasks } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Flag, FolderOpen, Plus, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTask?: Task | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({ open, onOpenChange, editTask }) => {
  const { addTask, updateTask } = useTasks();
  const isEditing = !!editTask;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    category: 'personal' as Category,
    deadline: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  // Populate form when editing
  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        category: editTask.category,
        deadline: format(editTask.deadline, "yyyy-MM-dd'T'HH:mm"),
      });
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'personal',
        deadline: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      });
    }
  }, [editTask, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category,
      deadline: new Date(formData.deadline),
    };

    if (isEditing && editTask) {
      updateTask(editTask.id, taskData);
    } else {
      addTask(taskData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Save className="w-5 h-5 text-primary" />
                Edit Task
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-primary" />
                Add New Task
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the details of your task below.' 
              : 'Fill in the details to create a new task.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add more details about this task..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Priority and Category row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5" />
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Priority) => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      <span className="flex items-center gap-2">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          priority === 'high' && "bg-priority-high",
                          priority === 'medium' && "bg-priority-medium",
                          priority === 'low' && "bg-priority-low"
                        )} />
                        {PRIORITY_CONFIG[priority].label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5" />
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value: Category) => 
                  setFormData(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline" className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Deadline
            </Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="hero"
              disabled={!formData.title.trim()}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Task
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
