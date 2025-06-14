export interface AnimalData {
  image_url: string; // emoji
  sound_text: string;
}

export interface Animal extends AnimalData {
  id: string; // Russian name, e.g., "корова"
  name: string; // Russian name, e.g., "Корова" (capitalized for display if needed)
}
