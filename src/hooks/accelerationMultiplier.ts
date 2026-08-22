/**
 * Turns scroll intensity into a spin-speed multiplier for Earth / clouds.
 *
 * intensity  0 → 1              (natural forward speed)
 * intensity  1 → maxMultiplier  (fastest forward)
 * intensity -1 → -maxMultiplier (fastest reverse)
 *
 * Negative intensity flips direction immediately so scroll-up feels instant.
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
