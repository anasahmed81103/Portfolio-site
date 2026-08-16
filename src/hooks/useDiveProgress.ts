/**
 * Scroll-scrubbed cinematic progress for Earth Dive (0 = space, 1 = horizon).
 * Refs only — wheel / useFrame never force React re-renders.
 */
export const diveProgressRef = { current: 0 };
export const diveTargetRef = { current: 0 };

/**
 * Past this progress, wheel energy for Space-style acceleration fades out
 * so the dive timeline takes over smoothly.
 */
export const ACCEL_HANDOFF_START = 0.15;
export const ACCEL_HANDOFF_END = 0.35;

export function useDiveProgress(): {
  progress: { current: number };
  target: { current: number };
} {
  return { progress: diveProgressRef, target: diveTargetRef };
}
