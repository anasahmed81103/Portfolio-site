import { Suspense } from 'react';
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

function SpaceScene() {
  return (
    <>
      <ScrollAccelerationTicker />
      <SpaceVisionReveal />

      <Starfield />

      <Suspense fallback={null}>
        <MilkyWay />

        <group rotation={[EARTH_AXIAL_TILT_X, 0, EARTH_AXIAL_TILT_Z]}>
          <Earth />
          <CloudLayer />
          <Atmosphere />
        </group>
      </Suspense>
    </>
  );
}

export default SpaceScene;
