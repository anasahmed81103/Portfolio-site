export type NewspaperPageId =
  | 'front'
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
  { id: 'experience', label: 'Experience', shortLabel: 'Work' },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects' },
  { id: 'education', label: 'Honors & Certifications', shortLabel: 'Honors' },
  { id: 'closing', label: 'Resume & Contact', shortLabel: 'Contact' },
] as const;

export const CHRONICLE_NAME = 'The Daily Developer';

export const EDITION_META = {
  volume: 'Vol. I',
  issue: 'No. 01',
  price: 'Complimentary',
  location: 'Karachi Edition',
} as const;

export const PROFILE = {
  fullName: 'Muhammad Anas Ahmed Shaikh',
  shortName: 'Anas Ahmed',
  location: 'Karachi, Pakistan',
  title: 'Full-Stack Software Engineer & AI Specialist',
  email: 'anasahmed81103@gmail.com',
  github: 'https://github.com/anasahmed81103',
  githubLabel: 'github.com/anasahmed81103',
  linkedin: 'https://www.linkedin.com/in/anasahmed81103/',
  linkedinLabel: 'linkedin.com/in/anasahmed81103',
  /** File lives in /public — spaces encoded for a safe URL. */
  resumeHref: '/resume%20anas%20ahmed.pdf',
  resumeDownloadName: 'Anas-Ahmed-Resume.pdf',
} as const;
