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
 * Earth Dive variant — faster catch-up / slower decay while waiting on the
 * hero-lock spin gate so less scrolling is needed to unlock the dive.
 */
function EarthDiveScrollAccelerationTicker() {
  useFrame((_, delta) => {
    const inSpinGate =
      diveProgressRef.current >= APPROACH_END - 0.0001 &&
      !earthSpinGateOpenRef.current;

    const decay = inSpinGate ? 0.4 : 1.2;
    const blendRate = inSpinGate ? 16 : 7;

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
