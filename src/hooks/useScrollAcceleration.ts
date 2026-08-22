/**
 * Shared “scroll makes Earth spin faster / reverse” values.
 *
 * Again: refs, not state — the wheel writes these; Earth.tsx reads them
 * inside useFrame without asking React to re-render.
 *
 * Signed range about [-1, 1]:
 *   +1  = boosted forward spin (scroll down)
 *    0  = natural idle spin
 *   -1  = boosted reverse spin (scroll up, Space only)
 *
 * Earth Dive only feeds positive values so the planet never spins backward
 * during the cinematic descent.
 */
export const scrollIntensityRef = { current: 0 };
export const scrollTargetRef = { current: 0 };

export function useScrollAcceleration(): {
  intensity: { current: number };
} {
  return { intensity: scrollIntensityRef };
}
