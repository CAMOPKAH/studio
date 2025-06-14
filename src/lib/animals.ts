import type { Animal, AnimalData } from '@/types';

export const ANIMAL_IDS = [
  "корова", "собака", "кошка", "петух", "курица", "поросёнок", "овца", "коза", 
  "лошадь", "утка", "гусь", "ворона", "воробей", "сова", "бобр", "голубь", 
  "лиса", "волк", "медведь", "ёжик", "белка", "заяц", "лягушка", "лебедь", 
  "мышка", "кузнечик", "пчела", "цыплёнок", "тюлень", "комар"
];

// Helper to capitalize first letter for display names
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function loadAnimalData(id: string): Promise<Animal | null> {
  try {
    const response = await fetch(`/animals_data/${id}.json`);
    if (!response.ok) {
      console.error(`Failed to fetch animal data for ${id}: ${response.statusText}`);
      return null;
    }
    const data = await response.json() as AnimalData;
    return { 
      ...data, 
      id: id, 
      name: capitalizeFirstLetter(id) // Use capitalized ID as name
    };
  } catch (error) {
    console.error(`Error loading animal data for ${id}:`, error);
    return null;
  }
}

export async function loadAllAnimals(): Promise<Animal[]> {
  const animalPromises = ANIMAL_IDS.map(id => loadAnimalData(id));
  const animalsData = await Promise.all(animalPromises);
  return animalsData.filter(animal => animal !== null) as Animal[];
}
