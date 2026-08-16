/**
 * Shared scroll “time acceleration” values.
 * Refs (not React state) so wheel events never re-render the tree.
 */
export const scrollIntensityRef = { current: 0 };
export const scrollTargetRef = { current: 0 };

export function useScrollAcceleration(): {
  intensity: { current: number };
} {
  return { intensity: scrollIntensityRef };
}
