/**
 * Stand-in newspaper plates in /public/assets/notebook.
 * Swap the files (keep the names) or point these paths at original photos later.
 */
export const notebookPhotos = {
  officeDesk: '/assets/notebook/office-desk.jpg',
  transformer: '/assets/notebook/transformer.jpg',
  powerLines: '/assets/notebook/power-lines.jpg',
  dataCharts: '/assets/notebook/data-charts.jpg',
  gazeEye: '/assets/notebook/gaze-eye.jpg',
  airplane: '/assets/notebook/airplane.jpg',
  campus: '/assets/notebook/campus.jpg',
  portrait: '/assets/notebook/portrait.jpg',
  /** CrossViewNet result strips — original project plates */
  cross1: '/assets/notebook/cross1.jpg',
  cross2: '/assets/notebook/cross2.jpg',
} as const;

export const STAND_IN_CREDIT = 'Stand-in · Pexels';
export const PROJECT_CREDIT = 'Project plate';
