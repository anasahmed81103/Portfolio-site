export const ExperienceStage = {
  Intro: 'intro',
  Space: 'space',
  EarthDive: 'earth-dive',
  Book: 'book',
  Notebook: 'notebook',
} as const;

export type ExperienceStage =
  (typeof ExperienceStage)[keyof typeof ExperienceStage];