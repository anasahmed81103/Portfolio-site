import { useFrame } from '@react-three/fiber';
import {
  diveProgressRef,
  diveTargetRef,
} from '../../hooks/useDiveProgress';

/**
 * Eases diveProgress toward diveTarget each frame (no React state).
 * Lower blend rate = softer catch-up, less “steppy” camera motion.
 */
function EarthDiveProgressTicker() {
  useFrame((_, delta) => {
    const blend = 1 - Math.exp(-delta * 2.2);
    diveProgressRef.current +=
      (diveTargetRef.current - diveProgressRef.current) * blend;

    if (Math.abs(diveProgressRef.current - diveTargetRef.current) < 0.00003) {
      diveProgressRef.current = diveTargetRef.current;
    }
  });

  return null;
}

export default EarthDiveProgressTicker;
