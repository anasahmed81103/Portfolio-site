/**
 * File paths for every clip used in the experience.
 *
 * Vite serves anything in /public at the site root, so
 * `/assets/sounds/space.mp3` means `public/assets/sounds/space.mp3`.
 *
 * Keys are TypeScript identifiers we pass to playTransition() / playLoop().
 * Sources and licenses: public/assets/sounds/SOURCES.md
 */
export const SOUNDS = {
  introReveal: '/assets/sounds/intro-reveal.mp3',
  spaceReveal: '/assets/sounds/space-reveal.mp3',
  space: '/assets/sounds/space.mp3',
  notebookReveal: '/assets/sounds/notebook-reveal.mp3',
  pageFlip: '/assets/sounds/page-flip.mp3',
  rocket: '/assets/sounds/rocket.mp3',
} as const;

/** Any key of SOUNDS — keeps play calls from using a typo path. */
export type SoundId = keyof typeof SOUNDS;
