import { useFrame } from '@react-three/fiber';
import {
  scrollIntensityRef,
  scrollTargetRef,
} from '../../hooks/useScrollAcceleration.ts';
import { diveProgressRef } from '../../hooks/useDiveProgress';
import {
  APPROACH_END,
  earthSpinGateOpenRef,
} from './earthDivePhases';

/**
 * Same job as ScrollAccelerationTicker, tuned for Earth Dive:
 * - target is forced ≥ 0 (no reverse spin during the cinematic)
 * - while the hero spin gate is closed, decay is slower and easing is snappier
 *   so scroll-to-spin feels punchy
 */
function EarthDiveScrollAccelerationTicker() {
  useFrame((_, delta) => {
    const inSpinWindow =
      diveProgressRef.current >= APPROACH_END - 0.0001 &&
      !earthSpinGateOpenRef.current;

    const decay = inSpinWindow ? 0.4 : 1.2;
    const blendRate = inSpinWindow ? 16 : 7;

    scrollTargetRef.current = Math.max(
      0,
      scrollTargetRef.current - delta * decay,
    );

    const blend = 1 - Math.exp(-delta * blendRate);
    scrollIntensityRef.current +=
      (scrollTargetRef.current - scrollIntensityRef.current) * blend;

    if (scrollIntensityRef.current < 0.001) {
      scrollIntensityRef.current = 0;
    }
  });

  return null;
}

export default EarthDiveScrollAccelerationTicker;
