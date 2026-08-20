import { useFrame } from '@react-three/fiber';
import {
  diveProgressRef,
  diveTargetRef,
} from '../../hooks/useDiveProgress';
import { APPROACH_END, earthSpinGateOpenRef } from './earthDivePhases';

/**
 * Eases diveProgress toward diveTarget each frame (no React state).
 * While the hero-lock gate is closed, progress never passes APPROACH_END.
 */
function EarthDiveProgressTicker() {
  useFrame((_, delta) => {
    if (!earthSpinGateOpenRef.current) {
      diveTargetRef.current = Math.min(diveTargetRef.current, APPROACH_END);
    }

    const approaching = diveProgressRef.current < APPROACH_END - 0.001;
    const rate = approaching ? 1.15 : 2.2;
    const blend = 1 - Math.exp(-delta * rate);
    diveProgressRef.current +=
      (diveTargetRef.current - diveProgressRef.current) * blend;

    if (!earthSpinGateOpenRef.current) {
      diveProgressRef.current = Math.min(
        diveProgressRef.current,
        APPROACH_END,
      );
    }

    if (Math.abs(diveProgressRef.current - diveTargetRef.current) < 0.00003) {
      diveProgressRef.current = diveTargetRef.current;
    }
  });

  return null;
}

export default EarthDiveProgressTicker;
