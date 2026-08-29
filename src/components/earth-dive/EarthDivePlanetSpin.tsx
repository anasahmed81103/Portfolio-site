import { useFrame } from '@react-three/fiber';
import { planetYawDriveRef } from '../../hooks/planetYawDrive';

/**
 * Dive yaw handoff — not a visual mesh.
 *
 * planetYawDriveRef is cleared every frame so Earth keeps its own scroll-driven
 * yaw (the same system as Space). The hero-lock gate lives on the HUD button
 * in OrbitalExperience, not on a timer here.
 */
function EarthDivePlanetSpin() {
  useFrame(() => {
    planetYawDriveRef.current = null;
  });

  return null;
}

export default EarthDivePlanetSpin;
