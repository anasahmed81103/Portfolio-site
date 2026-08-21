export type NewspaperPageId =
  | 'front'
  | 'about'
  | 'experience'
  | 'projects'
  | 'education'
  | 'closing';

export type NewspaperPageMeta = {
  id: NewspaperPageId;
  label: string;
  shortLabel: string;
};

export const NEWSPAPER_PAGES: readonly NewspaperPageMeta[] = [
  { id: 'front', label: 'Front Page', shortLabel: 'Front' },
  { id: 'about', label: 'About', shortLabel: 'About' },
  { id: 'experience', label: 'Experience', shortLabel: 'Work' },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects' },
  { id: 'education', label: 'Education & Skills', shortLabel: 'Edu' },
  { id: 'closing', label: 'Resume & Contact', shortLabel: 'Final' },
] as const;

export const CHRONICLE_NAME = 'The Anas Ahmed Chronicle';

export const EDITION_META = {
  volume: 'Vol. I',
  issue: 'No. 01',
  price: 'One curiosity',
  location: 'Earth Edition',
} as const;
