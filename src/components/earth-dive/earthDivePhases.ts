/**
 * Shared numbers for the Earth Dive chapter.
 *
 * diveProgressRef.current is a 0→1 “scrub” driven by the mouse wheel:
 *
 *   0 ──────── APPROACH_END (0.5) ──────── FLASH_START (0.85) ──── 1
 *   camera flies      hero horizon shot      solar flash grows     newspaper
 *   in from space     (spin-only for a bit)
 *
 * Several files import these constants so the camera, sun glow, flash,
 * and audio all stay on the same timeline.
 */
import { diveProgressRef } from '../../hooks/useDiveProgress';

/** Progress value where the camera locks on the approved horizon composition. */
export const APPROACH_END = 0.5;

/** Camera xyz, look-at direction, and slight roll for that hero shot. */
export const HERO_POSITION = [2.45, 0.32, 2.95] as const;
export const HERO_LOOK_AT = [0.9, 0.04, -0.7] as const;
export const HERO_ROLL = 0.05;

/** After arriving at the hero shot, scroll only spins Earth for this many seconds. */
export const HERO_SPIN_SECONDS = 2;

/** Last 15% of progress: the blue-white flash that covers the screen. */
export const FLASH_START = 0.85;

/** Real time spent sitting on the hero shot (counts up toward HERO_SPIN_SECONDS). */
export const heroSpinElapsedRef = { current: 0 };

/** Becomes true after the spin window — then scroll may advance past 0.5. */
export const earthSpinGateOpenRef = { current: false };

/**
 * How far through the solar flash we are (0 before FLASH_START, 1 at dive end).
 * Example: progress 0.925 is halfway from 0.85 to 1.0 → flashT = 0.5
 */
export function getFlashT(): number {
  const p = diveProgressRef.current;
  if (p <= FLASH_START) return 0;
  return Math.min(1, (p - FLASH_START) / (1 - FLASH_START));
}

/** Flash is essentially full-screen — time to swap to the newspaper. */
export function isBookHandoffReady(): boolean {
  return getFlashT() >= 0.995;
}
