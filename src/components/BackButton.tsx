
"use client";

import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
  isHidden?: boolean;
}

export function BackButton({ onClick, className, isHidden }: BackButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={cn(
        "fixed top-4 left-4 z-50 rounded-full w-12 h-12 bg-background/80 dark:bg-neutral-800/80 shadow-lg hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 transition-opacity duration-300 ease-in-out",
        isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100',
        className
      )}
      aria-label="Назад к уровням"
    >
      <Home className="h-6 w-6" />
    </Button>
  );
}
