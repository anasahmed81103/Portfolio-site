import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { diveProgressRef } from '../../hooks/useDiveProgress';
import {
  APPROACH_END,
  SPIN_NEEDED_RAD,
  earthRotationProgressRef,
  earthSpinAccumRef,
  earthSpinGateOpenRef,
} from './earthDivePhases';
import { planetYawDriveRef } from '../../hooks/planetYawDrive';
import { earthYawReadRef } from '../../hooks/planetYawDrive';

const TWO_PI = Math.PI * 2;

/**
 * Tracks Space-style spin until the dive unlocks.
 * Never freezes Earth — yaw drive stays null so scroll keeps spinning it.
 */
function EarthDivePlanetSpin() {
  const prevYawRef = useRef<number | null>(null);

  useFrame(() => {
    // Always let Earth/Clouds use normal scroll-acceleration spin
    planetYawDriveRef.current = null;

    const p = diveProgressRef.current;

    if (p < APPROACH_END) {
      earthSpinAccumRef.current = 0;
      earthRotationProgressRef.current = 0;
      earthSpinGateOpenRef.current = false;
      prevYawRef.current = null;
      return;
    }

    // Gate already open — keep spinning naturally, nothing else to track
    if (earthSpinGateOpenRef.current) {
      return;
    }

    const yaw = earthYawReadRef.current;
    if (prevYawRef.current !== null) {
      let dy = yaw - prevYawRef.current;
      if (dy > Math.PI) dy -= TWO_PI;
      if (dy < -Math.PI) dy += TWO_PI;
      if (dy > 0) {
        earthSpinAccumRef.current += dy;
      }
    }
    prevYawRef.current = yaw;

    earthRotationProgressRef.current = Math.min(
      1,
      earthSpinAccumRef.current / SPIN_NEEDED_RAD,
    );

    if (earthSpinAccumRef.current >= SPIN_NEEDED_RAD) {
      earthSpinGateOpenRef.current = true;
    }
  });

  return null;
}

export default EarthDivePlanetSpin;
