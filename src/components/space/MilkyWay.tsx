import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { LinearFilter, SRGBColorSpace, type Texture } from 'three';

/**
 * Why not a 360° skybox / EnvironmentMap?
 * Camera FOV is ~38°, so a real equirectangular sky only shows ~38° of 360° —
 * roughly ~200px of a 2048px panorama stretched across the screen = zoomed + blurry.
 *
 * Mapping the full 2:1 texture onto a large backdrop plane keeps the band sharp and wide.
 */
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
  // Frustum size at the backdrop depth — grows/shrinks with aspect ratio
  const view = viewport.getCurrentViewport(camera, [0, 0, BACKDROP_Z]);

  // Cover the viewport with a 2:1 plane (same aspect as milky-way.jpg)
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
        // Slightly subdued so Earth stays the hero
        color="#d0d4dc"
      />
    </mesh>
  );
}

export default MilkyWay;
