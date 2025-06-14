"use client";

import { useState, useEffect } from 'react';
import type { Animal } from '@/types';
import { loadAllAnimals } from '@/lib/animals';
import { LevelSelection } from '@/components/LevelSelection';
import { Level1 } from '@/components/Level1';
import { Level2 } from '@/components/Level2';
import { BackButton } from '@/components/BackButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react'; // For theme toggle example

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'levels' | 'level1' | 'level2'>('levels');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const fetchAnimals = async () => {
      setIsLoading(true);
      const loadedAnimals = await loadAllAnimals();
      setAnimals(loadedAnimals);
      setIsLoading(false);
    };
    fetchAnimals();

    // Theme persistence (optional)
    const storedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
  }, []);

  const handleSelectLevel = (level: 1 | 2) => {
    setCurrentView(level === 1 ? 'level1' : 'level2');
  };

  const showLevelSelection = () => {
    setCurrentView('levels');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('app-theme', newTheme);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-background text-foreground relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme} 
        className="absolute top-4 right-4"
        aria-label={theme === 'light' ? "Переключить на темную тему" : "Переключить на светлую тему"}
      >
        {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
      </Button>

      {currentView !== 'levels' && (
        <BackButton onClick={showLevelSelection} className="absolute top-4 left-4 z-10" />
      )}
      
      <header className="my-8 text-center">
        <h1 className="text-5xl font-headline font-bold text-primary drop-shadow-sm">
          Говорящие Зверята
        </h1>
      </header>

      <main className="w-full flex-grow flex flex-col items-center justify-center">
        {currentView === 'levels' && <LevelSelection onSelectLevel={handleSelectLevel} />}
        {currentView === 'level1' && <Level1 animals={animals} />}
        {currentView === 'level2' && <Level2 animals={animals} />}
      </main>
      
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Говорящие Зверята. Учим весело!
      </footer>
    </div>
  );
}
