
"use client";

import type { Animal } from '@/types';
import { AnimalCard } from '@/components/AnimalCard';
import { speak } from '@/lib/tts';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area";

interface Level1Props {
  animals: Animal[];
  isFullscreen?: boolean;
}

export function Level1({ animals, isFullscreen = false }: Level1Props) {
  const { toast } = useToast();

  const handleAnimalClick = async (animal: Animal) => {
    const textToSpeak = `${animal.sound_text}, ${animal.name}`;
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
  };
    
  return (
    <div className="w-full max-w-4xl flex flex-col items-center flex-grow">
       <h2 className="text-3xl font-headline mb-6 text-center text-primary">Уровень 1: Изучаем животных</h2>
      <ScrollArea className="w-full h-full flex-grow">
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-4 ${isFullscreen ? 'gap-8' : 'gap-4'}`}>
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} onClick={handleAnimalClick} isFullscreen={isFullscreen} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
