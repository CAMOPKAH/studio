
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Animal } from '@/types';
import { AnimalCard } from '@/components/AnimalCard';
import { speak } from '@/lib/tts';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Volume2, Zap } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface Level2Props {
  animals: Animal[];
  isFullscreen?: boolean;
}

const QUIZ_OPTIONS_COUNT = 4;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function Level2({ animals, isFullscreen = false }: Level2Props) {
  const { toast } = useToast();
  const [currentChallengeAnimal, setCurrentChallengeAnimal] = useState<Animal | null>(null);
  const [quizOptions, setQuizOptions] = useState<Animal[]>([]);
  const [isGuessing, setIsGuessing] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  const playSoundAndName = useCallback(async (animal: Animal) => {
    const textToSpeak = `${animal.sound_text} ${animal.name}`;
    try {
      await speak(textToSpeak);
    } catch (error: any) {
       const errorMessage = error.message === "TTS_NOT_SUPPORTED" 
        ? "Ваш браузер не поддерживает синтез речи."
        : `Не удалось воспроизвести звук: ${error.message || 'неизвестная ошибка'}`;
      toast({
        title: "Ошибка TTS",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  const selectNewChallenge = useCallback(() => {
    if (animals.length < QUIZ_OPTIONS_COUNT) {
      toast({ title: "Мало данных", description: "Недостаточно животных для начала викторины.", variant: "destructive" });
      return;
    }

    setIsGuessing(false);
    setShowFeedback(null);

    const randomIndex = Math.floor(Math.random() * animals.length);
    const correctAnimal = animals[randomIndex];
    setCurrentChallengeAnimal(correctAnimal);

    let distractors = animals.filter(a => a.id !== correctAnimal.id);
    distractors = shuffleArray(distractors).slice(0, QUIZ_OPTIONS_COUNT - 1);
    
    setQuizOptions(shuffleArray([correctAnimal, ...distractors]));
    
    playSoundAndName(correctAnimal);
  }, [animals, toast, playSoundAndName]);

  useEffect(() => {
    if (animals.length > 0) {
      selectNewChallenge();
    }
  }, [animals, selectNewChallenge]);

  const handleAnimalGuess = async (guessedAnimal: Animal) => {
    if (!currentChallengeAnimal || isGuessing) return;

    setIsGuessing(true);
    let feedbackText;

    if (guessedAnimal.id === currentChallengeAnimal.id) {
      feedbackText = "Молодец!!!";
      setShowFeedback("correct");
    } else {
      feedbackText = "Попробуй ещё";
      setShowFeedback("incorrect");
    }

    try {
      await speak(feedbackText);
    } catch (error: any) {
       const errorMessage = error.message === "TTS_NOT_SUPPORTED" 
        ? "Ваш браузер не поддерживает синтез речи."
        : `Не удалось воспроизвести звук: ${error.message || 'неизвестная ошибка'}`;
      toast({
        title: "Ошибка TTS",
        description: errorMessage,
        variant: "destructive",
      });
    }

    if (guessedAnimal.id === currentChallengeAnimal.id) {
      setTimeout(() => {
        selectNewChallenge();
      }, 1500); 
    } else {
      setTimeout(() => {
        setIsGuessing(false); 
        setShowFeedback(null); 
      }, 1500);
    }
  };

  if (!currentChallengeAnimal) {
    return <div className="flex items-center justify-center flex-grow"><p className="text-center text-xl p-8">Загрузка викторины...</p></div>;
  }
  
  return (
    <div className="w-full max-w-4xl flex flex-col items-center flex-grow">
      <h2 className="text-3xl font-headline mb-4 text-center text-primary">Уровень 2: Угадай животное</h2>
      <div className="mb-6 p-4 bg-card border rounded-lg shadow-md flex flex-col items-center">
        <p className="text-xl mb-2 text-foreground">Какое это животное?</p>
        <Button variant="outline" onClick={() => playSoundAndName(currentChallengeAnimal)} disabled={isGuessing} aria-label="Повторить звук">
          <Volume2 className="mr-2 h-5 w-5" /> Повторить звук
        </Button>
      </div>

      {showFeedback && (
        <div className={`mb-4 p-3 rounded-md text-lg font-semibold ${showFeedback === 'correct' ? 'bg-accent text-accent-foreground' : 'bg-destructive text-destructive-foreground'}`}>
          {showFeedback === 'correct' ? 'Молодец!!! 🎉' : 'Попробуй ещё 🤔'}
        </div>
      )}
      
      <ScrollArea className="w-full h-full flex-grow">
        <div className={`grid grid-cols-2 md:grid-cols-2 p-4 ${isFullscreen ? 'gap-8' : 'gap-4'}`}>
          {quizOptions.map((animal) => (
            <AnimalCard 
              key={animal.id} 
              animal={animal} 
              onClick={handleAnimalGuess} 
              disabled={isGuessing}
              isFullscreen={isFullscreen}
            />
          ))}
        </div>
      </ScrollArea>
      <Button variant="ghost" onClick={selectNewChallenge} className="mt-4" disabled={isGuessing} aria-label="Следующий вопрос">
        <Zap className="mr-2 h-5 w-5" /> Следующий вопрос
      </Button>
    </div>
  );
}
