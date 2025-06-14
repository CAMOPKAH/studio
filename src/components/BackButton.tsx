"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackButton({ onClick, className }: BackButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`text-lg px-6 py-3 ${className}`}
      aria-label="Назад к уровням"
    >
      <ArrowLeft className="mr-2 h-5 w-5" />
      Назад к уровням
    </Button>
  );
}
