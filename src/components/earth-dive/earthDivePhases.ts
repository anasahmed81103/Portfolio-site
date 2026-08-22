import { diveProgressRef } from '../../hooks/useDiveProgress';

/**
 * Earth Dive phases on diveProgress (0→1):
 * 0 → APPROACH_END     camera to hero horizon
 * hero lock            ~5s spin-only window, then dive unlocks
 * APPROACH_END → 1     dive into glowing right limb → solar flash → Notebook
 */
export const APPROACH_END = 0.5;

/** Locked hero composition (approved horizon shot). */
export const HERO_POSITION = [2.45, 0.32, 2.95] as const;
export const HERO_LOOK_AT = [0.9, 0.04, -0.7] as const;
export const HERO_ROLL = 0.05;

/** Seconds of scroll-to-spin at hero before scroll advances the dive. */
export const HERO_SPIN_SECONDS = 2;

/** Final ~15% of dive — blue-white solar flash builds to full cover. */
export const FLASH_START = 0.85;

/** Seconds spent at hero lock (counts up toward HERO_SPIN_SECONDS). */
export const heroSpinElapsedRef = { current: 0 };

/** True after HERO_SPIN_SECONDS at hero — dive scroll may begin. */
export const earthSpinGateOpenRef = { current: false };

/** 0 at FLASH_START, 1 at dive end — scroll-driven solar flash. */
export function getFlashT(): number {
  const p = diveProgressRef.current;
  if (p <= FLASH_START) return 0;
  return Math.min(1, (p - FLASH_START) / (1 - FLASH_START));
}

/** True when flash is fully opaque — hand off to Notebook / portfolio stage. */
export function isBookHandoffReady(): boolean {
  return getFlashT() >= 0.995;
}
