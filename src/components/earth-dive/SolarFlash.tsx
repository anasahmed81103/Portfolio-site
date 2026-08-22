import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Color,
  DoubleSide,
  type Mesh,
  type MeshBasicMaterial,
  Vector3,
} from 'three';
import { getFlashT } from './earthDivePhases';

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const _forward = new Vector3();
const _warmWhite = new Color('#fff4e0');
const _blueWhite = new Color('#eef6ff');

/**
 * Full-screen flash at the end of the dive.
 *
 * A plane is parented to the camera each frame (same position/rotation,
 * a little in front). Opacity and scale follow getFlashT() (0→1).
 * When it is fully opaque, BookHandoffBridge swaps to the newspaper.
 *
 * DoubleSide + depthTest={false} means it always paints on top, even if
 * Earth geometry is technically closer.
 */
function SolarFlash() {
  const { camera } = useThree();
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const cover = smoothstep(0, 1, getFlashT());

    const mat = mesh.material as MeshBasicMaterial;
    mat.opacity = cover;
    mesh.visible = cover > 0.005;

    if (!mesh.visible) return;

    camera.getWorldDirection(_forward);
    mesh.position.copy(camera.position).addScaledVector(_forward, 0.4);
    mesh.quaternion.copy(camera.quaternion);

    const s = 10 + cover * cover * 22;
    mesh.scale.set(s, s * 0.65, 1);

    mat.color.copy(_warmWhite).lerp(_blueWhite, cover);
  });

  return (
    <mesh ref={meshRef} visible={false} renderOrder={55}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#fff4e0"
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

export default SolarFlash;
