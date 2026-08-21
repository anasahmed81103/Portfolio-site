import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Earth from './Earth';
import CloudLayer from './CloudLayer';
import Atmosphere from './Atmosphere';
import MilkyWay from './MilkyWay';
import Starfield from './Starfield';
import ScrollAccelerationTicker from './ScrollAccelerationTicker';
import SpaceVisionReveal from './SpaceVisionReveal';
import {
  EARTH_AXIAL_TILT_X,
  EARTH_AXIAL_TILT_Z,
} from './earthConfig';
import EarthDiveScrollAccelerationTicker from '../earth-dive/EarthDiveScrollAccelerationTicker';
import EarthDiveProgressTicker from '../earth-dive/EarthDiveProgressTicker';
import EarthDiveController from '../earth-dive/EarthDiveController';
import EarthDivePlanetSpin from '../earth-dive/EarthDivePlanetSpin';
import SunHorizonEffect from '../earth-dive/SunHorizonEffect';
import CloudFlight from '../earth-dive/CloudFlight';
import SolarFlash from '../earth-dive/SolarFlash';
import { isBookHandoffReady } from '../earth-dive/earthDivePhases';

export type OrbitalMode = 'space' | 'dive';

type OrbitalSceneProps = {
  mode: OrbitalMode;
  /** When true, lights start at full intensity (debug jump straight into dive). */
  skipVisionReveal?: boolean;
  onBookHandoff?: () => void;
};

function BookHandoffBridge({ onBookHandoff }: { onBookHandoff?: () => void }) {
  const firedRef = useRef(false);

  useFrame(() => {
    if (firedRef.current || !onBookHandoff) return;
    if (isBookHandoffReady()) {
      firedRef.current = true;
      onBookHandoff();
    }
  });

  return null;
}

/**
 * Shared Space ↔ Earth Dive scene.
 * Earth / stars / lights stay mounted across the mode switch so the Canvas
 * never remounts and the handoff stays visually continuous.
 */
function OrbitalScene({
  mode,
  skipVisionReveal = false,
  onBookHandoff,
}: OrbitalSceneProps) {
  const isDive = mode === 'dive';

  return (
    <>
      {isDive ? (
        <EarthDiveScrollAccelerationTicker />
      ) : (
        <ScrollAccelerationTicker />
      )}

      <SpaceVisionReveal skipEntrance={skipVisionReveal} />

      {isDive ? (
        <>
          <EarthDiveProgressTicker />
          <BookHandoffBridge onBookHandoff={onBookHandoff} />
          <EarthDivePlanetSpin />
          <EarthDiveController />
        </>
      ) : null}

      <Starfield />

      <Suspense fallback={null}>
        <MilkyWay />

        <group rotation={[EARTH_AXIAL_TILT_X, 0, EARTH_AXIAL_TILT_Z]}>
          <Earth />
          <CloudLayer />
          <Atmosphere />
        </group>

        {isDive ? (
          <>
            <SunHorizonEffect />
            <CloudFlight />
            <SolarFlash />
          </>
        ) : null}
      </Suspense>
    </>
  );
}

export default OrbitalScene;
