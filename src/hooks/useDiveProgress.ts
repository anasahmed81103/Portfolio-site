/**
 * Earth Dive “how far through the descent are we?” (0 → 1).
 *
 * These are mutable refs, not React state. Wheel events and Three.js
 * `useFrame` (runs every rendered frame) write them constantly. If they were
 * useState, React would re-render the whole tree 60 times a second.
 *
 * - diveTargetRef   — where the wheel wants to go (jumps on each scroll tick)
 * - diveProgressRef — smoothed value that chases the target (see EarthDiveProgressTicker)
 *
 * 0 = still approaching the hero horizon shot
 * 0.5 (APPROACH_END) = locked on the hero shot
 * 1 = solar flash covers the screen → newspaper
 */
export const diveProgressRef = { current: 0 };
export const diveTargetRef = { current: 0 };

/**
 * While dive progress is still low, leftover Space-style spin-acceleration
 * is blended out so the camera timeline can take over cleanly.
 */
export const ACCEL_HANDOFF_START = 0.15;
export const ACCEL_HANDOFF_END = 0.35;

export function useDiveProgress(): {
  progress: { current: number };
  target: { current: number };
} {
  return { progress: diveProgressRef, target: diveTargetRef };
}
