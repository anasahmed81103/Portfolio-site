import { useFrame } from '@react-three/fiber';
import {
  scrollIntensityRef,
  scrollTargetRef,
} from '../../hooks/useScrollAcceleration.ts';

/**
 * Invisible R3F helper (renders nothing).
 *
 * The DOM wheel handler only *pokes* scrollTargetRef. This ticker, running
 * inside `useFrame`, does the smooth work:
 * - drain the target back toward 0 when the user stops scrolling
 * - ease scrollIntensityRef toward that target (exponential blend)
 *
 * `1 - Math.exp(-delta * 7)` is a frame-rate-independent lerp: faster machines
 * do not ease quicker than slower ones.
 *
 * Intensity is signed: + boosts Earth’s forward spin, − reverses it (Space).
 */
function ScrollAccelerationTicker() {
  useFrame((_, delta) => {
    // Drain target toward 0 from either side when the user stops scrolling
    const target = scrollTargetRef.current;
    if (target > 0) {
      scrollTargetRef.current = Math.max(0, target - delta * 1.2);
    } else if (target < 0) {
      scrollTargetRef.current = Math.min(0, target + delta * 1.2);
    }

    // Ease displayed intensity toward target (no hard jumps)
    const blend = 1 - Math.exp(-delta * 7);
    scrollIntensityRef.current +=
      (scrollTargetRef.current - scrollIntensityRef.current) * blend;

    if (Math.abs(scrollIntensityRef.current) < 0.001) {
      scrollIntensityRef.current = 0;
    }
  });

  return null;
}

export default ScrollAccelerationTicker;
