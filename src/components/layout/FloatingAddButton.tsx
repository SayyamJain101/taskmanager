import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="hero"
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg",
        "hover:scale-110 active:scale-95 transition-all duration-200",
        "z-50"
      )}
    >
      <Plus className="w-6 h-6" />
      <span className="sr-only">Add new task</span>
    </Button>
  );
};
