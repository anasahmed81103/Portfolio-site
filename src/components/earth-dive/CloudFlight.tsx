import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  type Mesh,
  type ShaderMaterial,
  Vector3,
} from 'three';
import { diveProgressRef } from '../../hooks/useDiveProgress';
import { APPROACH_END } from './earthDivePhases';

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const cloudPlaneVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const cloudPlaneFragmentShader = /* glsl */ `
uniform sampler2D cloudMap;
uniform float opacityMul;
uniform vec3 tint;
varying vec2 vUv;
void main() {
  vec3 cloudColor = texture2D(cloudMap, vUv).rgb;
  float alpha = dot(cloudColor, vec3(0.299, 0.587, 0.114));
  alpha = smoothstep(0.08, 0.55, alpha) * opacityMul;
  gl_FragColor = vec4(tint, alpha);
}
`;

type CloudLayerConfig = {
  forward: number;
  lateral: number;
  vertical: number;
  width: number;
  height: number;
  drift: number;
  maxOpacity: number;
  early: number;
};

const LAYERS: readonly CloudLayerConfig[] = [
  {
    forward: -4.2,
    lateral: -1.2,
    vertical: 0.4,
    width: 9,
    height: 5.5,
    drift: 0.01,
    maxOpacity: 0.42,
    early: 1,
  },
  {
    forward: -3.4,
    lateral: 1.6,
    vertical: -0.5,
    width: 8,
    height: 5,
    drift: 0.012,
    maxOpacity: 0.48,
    early: 0.95,
  },
  {
    forward: -2.4,
    lateral: -0.8,
    vertical: 0.2,
    width: 6.5,
    height: 4,
    drift: 0.018,
    maxOpacity: 0.58,
    early: 0.7,
  },
  {
    forward: -1.9,
    lateral: 1.1,
    vertical: -0.35,
    width: 6,
    height: 3.6,
    drift: 0.02,
    maxOpacity: 0.62,
    early: 0.55,
  },
  {
    forward: -1.15,
    lateral: -0.4,
    vertical: 0.15,
    width: 4.8,
    height: 3,
    drift: 0.03,
    maxOpacity: 0.75,
    early: 0.25,
  },
  {
    forward: -0.75,
    lateral: 0.55,
    vertical: -0.2,
    width: 4.2,
    height: 2.7,
    drift: 0.034,
    maxOpacity: 0.8,
    early: 0.1,
  },
];

const _forward = new Vector3();
const _right = new Vector3();
const _up = new Vector3();
const _pos = new Vector3();

/**
 * Cloud-flight layers for Phase 4 only — does not modify Earth's cloud shell.
 */
function CloudFlight() {
  const { camera } = useThree();
  const cloudMap = useTexture('/textures/earth/earth-clouds.jpg');
  const hazeRef = useRef<Mesh>(null);
  const meshRefs = useRef<(Mesh | null)[]>(LAYERS.map(() => null));
  const phasesRef = useRef(LAYERS.map((_, i) => i * 1.17));

  const uniformsList = useMemo(
    () =>
      LAYERS.map(() => ({
        cloudMap: { value: cloudMap },
        opacityMul: { value: 0 },
        tint: { value: new Color('#f2f6fb') },
      })),
    [cloudMap],
  );

  useFrame((_, delta) => {
    const p = diveProgressRef.current;
    if (p <= APPROACH_END) {
      for (const mesh of meshRefs.current) {
        if (mesh) mesh.visible = false;
      }
      if (hazeRef.current) hazeRef.current.visible = false;
      return;
    }

    const diveT = (p - APPROACH_END) / (1 - APPROACH_END);
    // Soft atmospheric haze builds toward the end — handoff into atmosphere scene
    const haze = smoothstep(0.15, 0.85, diveT);
    // Keep flight-clouds light; full cloud flight is the next scene
    const clouds = smoothstep(0.55, 1, diveT) * 0.45;

    camera.getWorldDirection(_forward);
    _right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    _up.set(0, 1, 0).applyQuaternion(camera.quaternion);

    for (let i = 0; i < LAYERS.length; i += 1) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;

      const config = LAYERS[i];
      const layerFade = smoothstep(0.2 - config.early * 0.2, 1, clouds);
      const opacity = clouds * layerFade * config.maxOpacity;

      (mesh.material as ShaderMaterial).uniforms.opacityMul.value = opacity;
      mesh.visible = opacity > 0.01;

      phasesRef.current[i] += delta * config.drift;
      const phase = phasesRef.current[i];

      _pos
        .copy(camera.position)
        .addScaledVector(_forward, config.forward)
        .addScaledVector(_right, config.lateral + Math.sin(phase) * 0.08)
        .addScaledVector(_up, config.vertical + Math.cos(phase * 0.7) * 0.05);

      mesh.position.copy(_pos);
      mesh.quaternion.copy(camera.quaternion);
      mesh.rotateX(-0.12);
    }

    if (hazeRef.current) {
      const mat = hazeRef.current.material;
      if ('opacity' in mat) {
        // Stronger blue haze at the end for atmosphere-scene handoff
        mat.opacity = haze * (0.28 + diveT * 0.35);
      }
      hazeRef.current.visible = haze > 0.01;
      hazeRef.current.position
        .copy(camera.position)
        .addScaledVector(_forward, -2.2);
      hazeRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group>
      <mesh ref={hazeRef} visible={false} renderOrder={8}>
        <planeGeometry args={[14, 9]} />
        <meshBasicMaterial
          color="#9ec8f0"
          transparent
          opacity={0}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
          side={DoubleSide}
        />
      </mesh>

      {LAYERS.map((config, index) => (
        <mesh
          key={index}
          ref={(node) => {
            meshRefs.current[index] = node;
          }}
          visible={false}
          renderOrder={9 + index}
        >
          <planeGeometry args={[config.width, config.height]} />
          <shaderMaterial
            uniforms={uniformsList[index]}
            vertexShader={cloudPlaneVertexShader}
            fragmentShader={cloudPlaneFragmentShader}
            transparent
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export default CloudFlight;
