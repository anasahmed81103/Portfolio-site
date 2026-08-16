import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import type { Group } from 'three';
import Earth from './Earth';
import CloudLayer from './CloudLayer';
import Atmosphere from './Atmosphere';
import MilkyWay from './MilkyWay';
import TwinklingStars from './TwinklingStars';
import {
  EARTH_AXIAL_TILT_X,
  EARTH_AXIAL_TILT_Z,
  SUN_POSITION,
} from './earthConfig';

/**
 * Barely perceptible same-sign drift (positive Y only).
 * Twinkle is stronger on the tiny far stars so the sky feels alive without blinking beacons.
 */
function Starfield() {
  const farRef = useRef<Group>(null);
  const midRef = useRef<Group>(null);
  const nearRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (farRef.current) farRef.current.rotation.y += delta * 0.0003;
    if (midRef.current) midRef.current.rotation.y += delta * 0.0005;
    if (nearRef.current) nearRef.current.rotation.y += delta * 0.0008;
  });

  return (
    <>
      {/* Dense tiny field — blends into the Milky Way; most of the shimmer lives here */}
      <group ref={farRef}>
        <Stars
          radius={0}
          depth={110}
          count={5200}
          factor={2.2}
          saturation={0}
          fade
          speed={0.55}
        />
      </group>

      <group ref={midRef}>
        <Stars
          radius={0}
          depth={75}
          count={1200}
          factor={3.8}
          saturation={0}
          fade
          speed={0.42}
        />
      </group>

      {/* Sparse brighter accents — still softer than the tiny field */}
      <group ref={nearRef}>
        <Stars
          radius={0}
          depth={45}
          count={220}
          factor={6.2}
          saturation={0}
          fade
          speed={0.3}
        />
      </group>
    </>
  );
}

function SpaceScene() {
  return (
    <>
      <ambientLight intensity={0.035} />
      <directionalLight
        position={SUN_POSITION.toArray()}
        intensity={2.4}
        color="#fff2dd"
      />

      <Starfield />
      <TwinklingStars />

      <Suspense fallback={null}>
        <MilkyWay />

        {/* Static axial tilt — Earth/clouds keep their own local Y spin inside */}
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
