import { useFrame } from '@react-three/fiber';
import {
  diveProgressRef,
  diveTargetRef,
} from '../../hooks/useDiveProgress';

/**
 * Eases diveProgress toward diveTarget each frame (no React state).
 */
function EarthDiveProgressTicker() {
  useFrame((_, delta) => {
    const blend = 1 - Math.exp(-delta * 4.5);
    diveProgressRef.current +=
      (diveTargetRef.current - diveProgressRef.current) * blend;

    if (Math.abs(diveProgressRef.current - diveTargetRef.current) < 0.00005) {
      diveProgressRef.current = diveTargetRef.current;
    }
  });

  return null;
}

export default EarthDiveProgressTicker;
