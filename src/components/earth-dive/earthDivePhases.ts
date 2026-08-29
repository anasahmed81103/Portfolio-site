/**
 * Shared numbers for the Earth Dive chapter.
 *
 * diveProgressRef.current is a 0→1 “scrub” driven by the mouse wheel:
 *
 *   0 ──────── APPROACH_END (0.5) ──────── FLASH_START (0.85) ──── 1
 *   camera flies      hero horizon shot      solar flash grows     newspaper
 *   in from space     (spin until progress_forward)
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

/**
 * Portrait crops the right limb / flare. Nudge the hero shot right so
 * phones still see half Earth, half space + sun — desktop stays exact.
 */
const MOBILE_HERO_POSITION_SHIFT = [0.2, 0, -0.08] as const;
const MOBILE_HERO_LOOK_SHIFT = [0.12, 0, 0.04] as const;

export function usesMobileHeroFraming(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 900px)').matches;
}

export function getHeroPosition(): [number, number, number] {
  if (!usesMobileHeroFraming()) {
    return [HERO_POSITION[0], HERO_POSITION[1], HERO_POSITION[2]];
  }
  return [
    HERO_POSITION[0] + MOBILE_HERO_POSITION_SHIFT[0],
    HERO_POSITION[1] + MOBILE_HERO_POSITION_SHIFT[1],
    HERO_POSITION[2] + MOBILE_HERO_POSITION_SHIFT[2],
  ];
}

export function getHeroLookAt(): [number, number, number] {
  if (!usesMobileHeroFraming()) {
    return [HERO_LOOK_AT[0], HERO_LOOK_AT[1], HERO_LOOK_AT[2]];
  }
  return [
    HERO_LOOK_AT[0] + MOBILE_HERO_LOOK_SHIFT[0],
    HERO_LOOK_AT[1] + MOBILE_HERO_LOOK_SHIFT[1],
    HERO_LOOK_AT[2] + MOBILE_HERO_LOOK_SHIFT[2],
  ];
}

/** Last 15% of progress: the blue-white flash that covers the screen. */
export const FLASH_START = 0.85;

/**
 * Closed at the hero shot so scroll only spins Earth.
 * The HUD progress button opens it — then scroll may advance past 0.5.
 */
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
