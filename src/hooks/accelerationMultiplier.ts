/**
 * Maps scroll intensity to a rotation-speed multiplier.
 *
 * intensity  0 → 1 (natural forward spin)
 * intensity  1 → maxMultiplier (boosted forward)
 * intensity -1 → -maxMultiplier (boosted reverse)
 *
 * Negative intensity flips direction immediately so scroll-up feels responsive.
 */
export function accelerationMultiplier(
  intensity: number,
  maxMultiplier: number,
): number {
  if (intensity >= 0) {
    return 1 + intensity * (maxMultiplier - 1);
  }

  const magnitude = Math.abs(intensity);
  return -(1 + magnitude * (maxMultiplier - 1));
}
