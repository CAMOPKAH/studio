# **App Name**: Говорящие Зверята

## Core Features:

- Level Selection: Level Selection: A landing page with buttons for level 1 (Learning) and level 2 (Quiz), plus a consistent 'Back to Levels' button throughout.
- Learning Mode: Learning Mode (Level 1): Displays animal images, plays TTS of '[animal_sound], [animal_name]' upon click, and has a 'Back to Levels' button.
- Quiz Mode: Quiz Mode (Level 2): Plays TTS of '[animal_sound] [animal_name]' on level start, presents animal images, and offers click-based guessing with TTS feedback ('Молодец!!!' for correct, 'Попробуй ещё' for incorrect).
- Data Management: Data Handling: Animal data loaded from /animal/*.json files, each containing image URL and sound text. The emoji will be used for Level 1 and Level 2 as the `image_url`.
- TTS Engine: TTS Integration: Employs browser TTS (Web Speech API, lang='ru-RU') for sound output, preloading data and using single-page design, with error fallback to alert messages.

## Style Guidelines:

- Primary color: A gentle sky blue (#87CEEB) to create a calm and inviting atmosphere suitable for young learners.
- Background color: A very light, desaturated blue (#F0F8FF), nearly white, providing a soft and clean backdrop.
- Accent color: A soft, muted green (#98FB98) for positive feedback cues, offering a subtle contrast that doesn’t overwhelm the young audience.
- Body and headline font: 'PT Sans' (sans-serif), which is modern with some warmth, for maximum readability in both headlines and body text.
- Simple, visually clear icons for navigation (e.g., back arrow, home button), enhancing usability for children.
- Large, easily tappable buttons are essential to improving UX on the buttons in this application