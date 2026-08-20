import { useFrame } from '@react-three/fiber';
import {
  diveProgressRef,
  diveTargetRef,
} from '../../hooks/useDiveProgress';
import { APPROACH_END } from './earthDivePhases';

/**
 * Eases diveProgress toward diveTarget each frame (no React state).
 * Approach uses a softer blend so the long push-in from space feels calm;
 * dive / flash keep a slightly snappier catch-up.
 */
function EarthDiveProgressTicker() {
  useFrame((_, delta) => {
    const approaching = diveProgressRef.current < APPROACH_END - 0.001;
    const rate = approaching ? 1.15 : 2.2;
    const blend = 1 - Math.exp(-delta * rate);
    diveProgressRef.current +=
      (diveTargetRef.current - diveProgressRef.current) * blend;

    if (Math.abs(diveProgressRef.current - diveTargetRef.current) < 0.00003) {
      diveProgressRef.current = diveTargetRef.current;
    }
  });

  return null;
}

export default EarthDiveProgressTicker;
