import { Suspense } from 'react';
import Earth from '../space/Earth';
import CloudLayer from '../space/CloudLayer';
import Atmosphere from '../space/Atmosphere';
import MilkyWay from '../space/MilkyWay';
import Starfield from '../space/Starfield';
import ScrollAccelerationTicker from '../space/ScrollAccelerationTicker';
import {
  EARTH_AXIAL_TILT_X,
  EARTH_AXIAL_TILT_Z,
  SUN_POSITION,
} from '../space/earthConfig';
import EarthDiveController from './EarthDiveController';
import EarthDiveProgressTicker from './EarthDiveProgressTicker';
import SunHorizonEffect from './SunHorizonEffect';

/**
 * Same Earth building blocks as Space, plus dive progress + camera choreography.
 * SpaceScene stays untouched — this is the cinematic approach module.
 */
function EarthDiveScene() {
  return (
    <>
      <ScrollAccelerationTicker />
      <EarthDiveProgressTicker />
      <EarthDiveController />

      <ambientLight intensity={0.035} />
      <directionalLight
        position={SUN_POSITION.toArray()}
        intensity={2.4}
        color="#fff2dd"
      />

      <Starfield />

      <Suspense fallback={null}>
        <MilkyWay />

        <group rotation={[EARTH_AXIAL_TILT_X, 0, EARTH_AXIAL_TILT_Z]}>
          <Earth />
          <CloudLayer />
          <Atmosphere />
        </group>

        <SunHorizonEffect />
      </Suspense>
    </>
  );
}

export default EarthDiveScene;
