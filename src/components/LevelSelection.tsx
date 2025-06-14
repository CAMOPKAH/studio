"use client";

import { Button } from '@/components/ui/button';

interface LevelSelectionProps {
  onSelectLevel: (level: 1 | 2) => void;
}

export function LevelSelection({ onSelectLevel }: LevelSelectionProps) {
  return (
    <div className="flex flex-col items-center space-y-6">
      <Button
        onClick={() => onSelectLevel(1)}
        className="w-64 h-20 text-2xl rounded-lg shadow-md hover:shadow-lg transition-shadow"
        aria-label="Уровень 1: Изучение"
      >
        Уровень 1
      </Button>
      <Button
        onClick={() => onSelectLevel(2)}
        className="w-64 h-20 text-2xl rounded-lg shadow-md hover:shadow-lg transition-shadow"
        aria-label="Уровень 2: Викторина"
      >
        Уровень 2
      </Button>
    </div>
  );
}
