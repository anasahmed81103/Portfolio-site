import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { DoubleSide, type Mesh, type MeshBasicMaterial, Vector3 } from 'three';
import { EARTH_RADIUS } from '../space/earthConfig';

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const _forward = new Vector3();

/**
 * Full-screen atmosphere blue when the camera clips into the Earth mesh,
 * so we never see through the planet geometry.
 */
function EarthPenetrationVeil() {
  const { camera } = useThree();
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const radius = camera.position.length();
    // Soft build just outside the surface, then solid once inside the mesh
    const cover = smoothstep(EARTH_RADIUS * 1.06, EARTH_RADIUS * 0.99, radius);

    const mat = mesh.material as MeshBasicMaterial;
    mat.opacity = cover;
    mesh.visible = cover > 0.01;

    if (!mesh.visible) return;

    camera.getWorldDirection(_forward);
    mesh.position.copy(camera.position).addScaledVector(_forward, 0.35);
    mesh.quaternion.copy(camera.quaternion);
  });

  return (
    <mesh ref={meshRef} visible={false} renderOrder={50}>
      <planeGeometry args={[20, 12]} />
      <meshBasicMaterial
        color="#5aa8e8"
        transparent
        opacity={0}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        side={DoubleSide}
      />
    </mesh>
  );
}

export default EarthPenetrationVeil;
