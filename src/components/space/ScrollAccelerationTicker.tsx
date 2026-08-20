import { useFrame } from '@react-three/fiber';
import {
  scrollIntensityRef,
  scrollTargetRef,
} from '../../hooks/useScrollAcceleration.ts';

/**
 * Runs inside the R3F Canvas.
 * Smoothly eases intensity toward the wheel target and decays when idle.
 * Intensity is signed: + boosts natural spin, − reverses it.
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
