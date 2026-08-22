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
 * Hero-lock timer — not a visual mesh.
 *
 * When dive progress first hits APPROACH_END we start a real-time clock.
 * For HERO_SPIN_SECONDS, scroll may only spin Earth (gate closed).
 * Then earthSpinGateOpenRef becomes true and the camera may dive onward.
 *
 * planetYawDriveRef is cleared every frame so Earth keeps its own scroll-driven
 * yaw (the same system as Space). This file only owns the *timer / gate*.
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
