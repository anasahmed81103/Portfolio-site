/**
 * Star-band backdrop behind Earth.
 *
 * Why a huge flat plane instead of a 360° skybox?
 * The camera FOV is only ~38°. Mapping a full equirectangular panorama onto
 * a sky sphere would show a tiny slice of the image — it looks zoomed and blurry.
 * Stretching the 2:1 milky-way.jpg onto a plane that covers the view keeps
 * the band sharp and wide.
 *
 * `useThree` is R3F’s hook for the live camera / renderer / viewport.
 * `viewport.getCurrentViewport(camera, point)` = how big the view is at that depth.
 */
import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { LinearFilter, SRGBColorSpace, type Texture } from 'three';

const BACKDROP_Z = -42;
/** Extra scale so edges never peek through on resize / ultrawide. */
const COVER_MARGIN = 1.2;

function configureMilkyWayTexture(texture: Texture) {
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
}

function MilkyWay() {
  const milkyWayMap = useTexture(
    '/textures/earth/milky-way.jpg',
    configureMilkyWayTexture,
  );

  const { camera, viewport } = useThree();
  const view = viewport.getCurrentViewport(camera, [0, 0, BACKDROP_Z]);

  // Cover the viewport with a 2:1 plane (same aspect as the JPEG).
  const coverHeight = Math.max(view.height, view.width / 2) * COVER_MARGIN;
  const coverWidth = coverHeight * 2;

  return (
    <mesh position={[0, 0, BACKDROP_Z]} renderOrder={-1000} frustumCulled={false}>
      <planeGeometry args={[coverWidth, coverHeight]} />
      <meshBasicMaterial
        map={milkyWayMap}
        toneMapped={false}
        depthWrite={false}
        depthTest={false}
        color="#d0d4dc"
      />
    </mesh>
  );
}

export default MilkyWay;
