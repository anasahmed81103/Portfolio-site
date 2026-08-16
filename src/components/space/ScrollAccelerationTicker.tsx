import { useFrame } from '@react-three/fiber';
import {
  scrollIntensityRef,
  scrollTargetRef,
} from '../../hooks/useScrollAcceleration.ts';

/**
 * Runs inside the R3F Canvas.
 * Smoothly eases intensity toward the wheel target and decays when idle.
 */
function ScrollAccelerationTicker() {
  useFrame((_, delta) => {
    // Drain target when the user stops scrolling
    scrollTargetRef.current = Math.max(
      0,
      scrollTargetRef.current - delta * 1.2,
    );

    // Ease displayed intensity toward target (no hard jumps)
    const blend = 1 - Math.exp(-delta * 7);
    scrollIntensityRef.current +=
      (scrollTargetRef.current - scrollIntensityRef.current) * blend;

    if (scrollIntensityRef.current < 0.001) {
      scrollIntensityRef.current = 0;
    }
  });

  return null;
}

export default ScrollAccelerationTicker;
