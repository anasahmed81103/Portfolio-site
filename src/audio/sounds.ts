/** Public sound assets under /public/assets/sounds */
export const SOUNDS = {
  introReveal: '/assets/sounds/intro-reveal.mp3',
  spaceReveal: '/assets/sounds/space-reveal.mp3',
  space: '/assets/sounds/space.mp3',
  notebookReveal: '/assets/sounds/notebook-reveal.mp3',
  pageFlip: '/assets/sounds/page-flip.mp3',
  rocket: '/assets/sounds/rocket.mp3',
} as const;

export type SoundId = keyof typeof SOUNDS;
