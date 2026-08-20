import { useFrame } from '@react-three/fiber';
import { diveProgressRef } from '../../hooks/useDiveProgress';
import {
  APPROACH_END,
  HERO_SPIN_SECONDS,
  earthSpinGateOpenRef,
  heroSpinElapsedRef,
} from './earthDivePhases';
import { planetYawDriveRef } from '../../hooks/planetYawDrive';

/**
 * At hero lock, count real time. First HERO_SPIN_SECONDS: scroll spins Earth.
 * After that, open the gate so scroll advances the dive.
 */
function EarthDivePlanetSpin() {
  useFrame((_, delta) => {
    planetYawDriveRef.current = null;

    const p = diveProgressRef.current;

    if (p < APPROACH_END - 0.0001) {
      heroSpinElapsedRef.current = 0;
      earthSpinGateOpenRef.current = false;
      return;
    }

    if (earthSpinGateOpenRef.current) return;

    heroSpinElapsedRef.current += delta;
    if (heroSpinElapsedRef.current >= HERO_SPIN_SECONDS) {
      heroSpinElapsedRef.current = HERO_SPIN_SECONDS;
      earthSpinGateOpenRef.current = true;
    }
  });

  return null;
}

export default EarthDivePlanetSpin;
