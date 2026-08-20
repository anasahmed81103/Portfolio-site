/**
 * Shared scroll “time acceleration” values.
 * Refs (not React state) so wheel events never re-render the tree.
 *
 * Signed range ≈ [-1, 1]:
 *   + intensifies the natural forward spin
 *   − reverses spin (SpaceExperience scroll-up)
 * Earth Dive keeps feeding positive values only.
 */
export const scrollIntensityRef = { current: 0 };
export const scrollTargetRef = { current: 0 };

export function useScrollAcceleration(): {
  intensity: { current: number };
} {
  return { intensity: scrollIntensityRef };
}
