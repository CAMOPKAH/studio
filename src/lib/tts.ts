export function speak(text: string, lang: string = 'ru-RU'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      reject(new Error("TTS_NOT_SUPPORTED"));
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const russianVoice = voices.find(voice => voice.lang === 'ru-RU');
      
      if (russianVoice) {
        utterance.voice = russianVoice;
      } else {
        // Fallback if no specific Russian voice, browser will use default for lang
        console.warn(`TTS: No Russian voice found for lang ${lang}. Using default.`);
      }
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        console.error("TTS Error:", event);
        reject(new Error(event.error || "UNKNOWN_TTS_ERROR"));
      };
      
      window.speechSynthesis.speak(utterance);
    };

    // Voices might load asynchronously.
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Ensure this is only called once
        window.speechSynthesis.onvoiceschanged = null; 
        trySpeak();
      };
    } else {
      trySpeak();
    }
  });
}
