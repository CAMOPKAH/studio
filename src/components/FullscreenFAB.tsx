
"use client";

import { Button } from '@/components/ui/button';
import { Maximize, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FullscreenFABProps {
  isFullscreen: boolean;
  onClick: () => void;
  className?: string;
  apiAvailable: boolean;
}

export function FullscreenFAB({ isFullscreen, onClick, className, apiAvailable }: FullscreenFABProps) {
  if (!apiAvailable) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      // Using PRD specific styles directly for background, border-radius, and box-shadow
      // Tailwind classes are used for other aspects like positioning, size, z-index, hover.
      // Note: rgba background won't respect dark/light theme automatically like HSL vars.
      style={{
        background: 'rgba(255,255,255,0.9)', // PRD: background: rgba(255,255,255,0.9);
        borderRadius: '50%', // PRD: border-radius: 50%;
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', // PRD: box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }}
      className={cn(
        "fixed bottom-4 right-4 z-50 w-12 h-12 p-0 border-none", // Removed default border, p-0 for icon precise control
        "hover:bg-neutral-200/90 dark:hover:bg-neutral-700/90", // Basic hover, can be adjusted
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2",
        "transition-opacity duration-300 ease-in-out",
        className
      )}
      aria-label={isFullscreen ? "Выйти из полноэкранного режима" : "Войти в полноэкранный режим"}
    >
      {isFullscreen ? <Minimize2 className="h-6 w-6 text-foreground" /> : <Maximize className="h-6 w-6 text-foreground" />}
    </Button>
  );
}
