/** base * lerp(1, maxMultiplier, intensity) */
export function accelerationMultiplier(
  intensity: number,
  maxMultiplier: number,
): number {
  return 1 + intensity * (maxMultiplier - 1);
}
