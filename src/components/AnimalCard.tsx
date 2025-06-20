
"use client";

import type { Animal } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimalCardProps {
  animal: Animal;
  onClick: (animal: Animal) => void;
  disabled?: boolean;
  highlight?: boolean;
  isFullscreen?: boolean;
}

export function AnimalCard({ animal, onClick, disabled = false, highlight = false, isFullscreen = false }: AnimalCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-lg transition-all duration-300 select-none",
        disabled && "opacity-50 cursor-not-allowed",
        highlight && "ring-4 ring-accent shadow-accent",
        isFullscreen ? "scale-125" : "scale-100",
      )}
      onClick={() => !disabled && onClick(animal)}
      aria-label={animal.name}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          onClick(animal);
        }
      }}
    >
      <CardContent className="flex flex-col items-center justify-center p-4 aspect-square">
        <div className="text-6xl md:text-7xl lg:text-8xl" aria-hidden="true">
          {animal.image_url}
        </div>
        <p className="mt-2 text-sm md:text-base text-center font-medium text-foreground truncate w-full">{animal.name}</p>
      </CardContent>
    </Card>
  );
}
