/**
 * High-level “chapters” of the site.
 *
 * The visitor always walks this path:
 *   Intro (sketchbook) → Space (orbit) → Earth Dive (descent) → Notebook (portfolio)
 *
 * `as const` freezes the object so TypeScript treats each value as a literal
 * string ('intro', not just string). The type below is then “any of those values”.
 */
export const ExperienceStage = {
  Intro: 'intro',
  Space: 'space',
  EarthDive: 'earth-dive',
  Notebook: 'notebook',
} as const;

export type ExperienceStage =
  (typeof ExperienceStage)[keyof typeof ExperienceStage];
