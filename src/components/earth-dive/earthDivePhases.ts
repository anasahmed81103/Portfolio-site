import { diveProgressRef } from '../../hooks/useDiveProgress';

/**
 * Earth Dive phases on diveProgress (0→1):
 * 0 → APPROACH_END     camera to hero horizon
 * spin (progress frozen) Space-style Earth spin
 * APPROACH_END → 1     dive into glowing right limb → solar flash → Book
 */
export const APPROACH_END = 0.5;

/** Locked hero composition (approved horizon shot). */
export const HERO_POSITION = [2.45, 0.32, 2.95] as const;
export const HERO_LOOK_AT = [0.9, 0.04, -0.7] as const;
export const HERO_ROLL = 0.05;

/** Short Space-style spin before the dive unlocks (~⅕ turn). */
export const SPIN_NEEDED_RAD = 0.2;

/** Final ~15% of dive — blue-white solar flash builds to full cover. */
export const FLASH_START = 0.85;

/** 0→1 through the required spin. */
export const earthRotationProgressRef = { current: 0 };

/** Radians spun since hero lock. */
export const earthSpinAccumRef = { current: 0 };

/** True after SPIN_NEEDED_RAD — dive scroll may begin. */
export const earthSpinGateOpenRef = { current: false };

/** How far through the limb dive (0 before dive, 1 at end). */
export function getAtmosphereEntryT(): number {
  const p = diveProgressRef.current;
  if (p <= APPROACH_END) return 0;
  return Math.min(1, (p - APPROACH_END) / (1 - APPROACH_END));
}

/** 0 at FLASH_START, 1 at dive end — scroll-driven solar flash. */
export function getFlashT(): number {
  const p = diveProgressRef.current;
  if (p <= FLASH_START) return 0;
  return Math.min(1, (p - FLASH_START) / (1 - FLASH_START));
}

/** True when flash is fully opaque — hand off to Book stage. */
export function isBookHandoffReady(): boolean {
  return getFlashT() >= 0.995;
}
