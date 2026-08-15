import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import type { Group } from 'three';

/** Temporary centered marker — replaced by Earth in the next major phase. */
function PlaceholderBody() {
  return (
    <mesh>
      <sphereGeometry args={[0.55, 32, 32]} />
      <meshStandardMaterial color="#2a3548" roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

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
          factor={2.2}
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
          factor={4}
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
          factor={6}
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
      <ambientLight intensity={0.18} />
      <directionalLight position={[4, 3, 5]} intensity={1} />

      <Starfield />
      <PlaceholderBody />
    </>
  );
}

export default SpaceScene;
