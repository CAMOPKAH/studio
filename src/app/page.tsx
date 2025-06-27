
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Animal } from '@/types';
import { loadAllAnimals } from '@/lib/animals';
import { LevelSelection } from '@/components/LevelSelection';
import { Level1 } from '@/components/Level1';
import { Level2 } from '@/components/Level2';
import { BackButton } from '@/components/BackButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Maximize, Home } from 'lucide-react';
import { FullscreenFAB } from '@/components/FullscreenFAB';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'levels' | 'level1' | 'level2'>('levels');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenApiAvailable, setFullscreenApiAvailable] = useState(true);
  const [showFullscreenTooltip, setShowFullscreenTooltip] = useState(false);
  const [hasAttemptedFullscreenOnce, setHasAttemptedFullscreenOnce] = useState(false);
  const [isLikelyMobile, setIsLikelyMobile] = useState(false);

  const isLikelyMobileRef = useRef(isLikelyMobile);
  useEffect(() => { isLikelyMobileRef.current = isLikelyMobile; }, [isLikelyMobile]);

  const showFullscreenTooltipRef = useRef(showFullscreenTooltip);
  useEffect(() => { showFullscreenTooltipRef.current = showFullscreenTooltip; }, [showFullscreenTooltip]);

  const manageOrientation = useCallback(async (lock: boolean) => {
    if (!isLikelyMobileRef.current || !(window.screen && window.screen.orientation)) {
      return;
    }
    try {
      /*
      if (lock) {
        if (typeof window.screen.orientation.lock === 'function') {
          await window.screen.orientation.lock('landscape-primary');
        }
      } else {
        if (typeof window.screen.orientation.unlock === 'function') {
          window.screen.orientation.unlock();
        }
      }*/
     console.log('Comment: orentation false');
    } catch (err) {
      console.warn(`Failed to ${lock ? 'lock' : 'unlock'} screen orientation:`, err);
    }
  }, []);

  const requestAppFullscreen = useCallback(async () => {
    if (!fullscreenApiAvailable || document.fullscreenElement) return;
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      setShowFullscreenTooltip(false);
      if (isLikelyMobileRef.current) await manageOrientation(true);
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
      setShowFullscreenTooltip(true); // Show tooltip if request fails
    }
    if (!hasAttemptedFullscreenOnce) setHasAttemptedFullscreenOnce(true);
  }, [fullscreenApiAvailable, hasAttemptedFullscreenOnce, manageOrientation]);

  const exitAppFullscreen = useCallback(async () => {
    if (!fullscreenApiAvailable || !document.fullscreenElement) return;
    try {
      await document.exitFullscreen();
      setIsFullscreen(false);
      // Orientation unlock handled by fullscreenchange event
    } catch (error) {
      console.error("Failed to exit fullscreen:", error);
    }
  }, [fullscreenApiAvailable]);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitAppFullscreen();
    } else {
      requestAppFullscreen();
    }
  }, [isFullscreen, exitAppFullscreen, requestAppFullscreen]);

  useEffect(() => {
    const fetchAnimals = async () => {
      setIsLoading(true);
      const loadedAnimals = await loadAllAnimals();
      setAnimals(loadedAnimals);
      setIsLoading(false);
    };
    fetchAnimals();

    const storedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }

    setIsLikelyMobile(window.matchMedia("(max-width: 768px)").matches);
    setFullscreenApiAvailable(!!document.documentElement.requestFullscreen);

    const handleFullscreenChange = () => {
      const currentlyFullscreen = document.fullscreenElement !== null;
      setIsFullscreen(currentlyFullscreen);
      if (!currentlyFullscreen) {
        if (isLikelyMobileRef.current) manageOrientation(false);
        if (showFullscreenTooltipRef.current) setShowFullscreenTooltip(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      // Ensure orientation is unlocked if component unmounts while fullscreen
      if (document.fullscreenElement && isLikelyMobileRef.current) {
        manageOrientation(false);
      }
    };
  }, [manageOrientation]);


  const handleSelectLevel = useCallback((level: 1 | 2) => {
    setCurrentView(level === 1 ? 'level1' : 'level2');
    if (fullscreenApiAvailable) {
        requestAppFullscreen();
    }
  }, [fullscreenApiAvailable, requestAppFullscreen]);

  const showLevelSelection = useCallback(() => {
    if (isFullscreen) {
      exitAppFullscreen();
    }
    setCurrentView('levels');
  }, [isFullscreen, exitAppFullscreen]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('app-theme', newTheme);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const isInLevel = currentView !== 'levels';

  return (
    <div className={`flex flex-col items-center min-h-screen p-4 bg-background text-foreground relative transition-all duration-300 ease-in-out ${isInLevel ? 'pt-16' : 'pt-4'}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme} 
        className={`absolute top-4 right-4 transition-opacity duration-300 ease-in-out ${isInLevel ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label={theme === 'light' ? "Переключить на темную тему" : "Переключить на светлую тему"}
      >
        {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
      </Button>

      <BackButton 
        onClick={showLevelSelection} 
        isHidden={!isInLevel} 
      />
      
      <main className={`w-full flex-grow flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out ${isInLevel && !isFullscreen && showFullscreenTooltip ? 'pt-8' : ''}`}>
        {currentView === 'levels' && <LevelSelection onSelectLevel={handleSelectLevel} />}
        {currentView === 'level1' && <Level1 animals={animals} isFullscreen={isFullscreen} />}
        {currentView === 'level2' && <Level2 animals={animals} isFullscreen={isFullscreen} />}
      </main>
      
      <footer className={`py-4 text-center text-sm text-muted-foreground transition-opacity duration-300 ease-in-out ${isInLevel ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        © {new Date().getFullYear()} Говорящие Зверята. Учим весело!
      </footer>

      <FullscreenFAB
        isFullscreen={isFullscreen}
        onClick={toggleFullscreen}
        apiAvailable={fullscreenApiAvailable}
        className={`${showFullscreenTooltip ? 'animate-pulse-吸引注意力' : ''} ${!isInLevel ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      />

      {showFullscreenTooltip && isInLevel && (
        <div 
            className="fixed bottom-20 right-4 z-[60] mb-2 p-3 bg-foreground text-background text-xs rounded-md shadow-lg flex items-center space-x-2"
            role="tooltip"
        >
            <span>Нажмите</span> <Maximize className="inline h-4 w-4" /> <span>для полноэкранного режима.</span>
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-foreground -mb-[7px]"></div>
        </div>
      )}
    </div> 
  );
}
