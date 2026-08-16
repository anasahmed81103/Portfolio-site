import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import type { Group } from 'three';
import Earth from './Earth';
import CloudLayer from './CloudLayer';
import Atmosphere from './Atmosphere';
import MilkyWay from './MilkyWay';
import {
  EARTH_AXIAL_TILT_X,
  EARTH_AXIAL_TILT_Z,
  SUN_POSITION,
} from './earthConfig';

/**
 * Same-sign drift on every layer (positive Y only) so it feels like travel, not spin.
 * Far is slowest; near is slightly faster — never opposite directions.
 */
function Starfield() {
  const farRef = useRef<Group>(null);
  const midRef = useRef<Group>(null);
  const nearRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (farRef.current) farRef.current.rotation.y += delta * 0.0015;
    if (midRef.current) midRef.current.rotation.y += delta * 0.0025;
    if (nearRef.current) nearRef.current.rotation.y += delta * 0.004;
  });

  return (
    <>
      <group ref={farRef}>
        <Stars
          radius={0}
          depth={100}
          count={3800}
          factor={2.6}
          saturation={0}
          fade
          speed={0.25}
        />
      </group>

      <group ref={midRef}>
        <Stars
          radius={0}
          depth={70}
          count={900}
          factor={4.4}
          saturation={0}
          fade
          speed={0.4}
        />
      </group>

      <group ref={nearRef}>
        <Stars
          radius={0}
          depth={45}
          count={220}
          factor={6.5}
          saturation={0}
          fade
          speed={0.55}
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
