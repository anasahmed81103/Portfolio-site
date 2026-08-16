import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { SRGBColorSpace, type Group, type Texture } from 'three';
import { EARTH_RADIUS, SUN_POSITION } from './earthConfig';
import {
  useScrollAcceleration,
} from '../../hooks/useScrollAcceleration.ts';
import { accelerationMultiplier } from '../../hooks/accelerationMultiplier';

const EARTH_TEXTURE_URLS = [
  '/textures/earth/earth-day.jpg',
  '/textures/earth/earth-night.jpg',
] as const;

function applyColorTextures(textures: Texture[]) {
  for (const texture of textures) {
    texture.colorSpace = SRGBColorSpace;
  }
}

const earthVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldNormal;

void main() {
  vUv = uv;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const earthFragmentShader = /* glsl */ `
uniform sampler2D dayMap;
uniform sampler2D nightMap;
uniform vec3 sunDirection;

varying vec2 vUv;
varying vec3 vWorldNormal;

void main() {
  vec3 dayColor = texture2D(dayMap, vUv).rgb;
  vec3 nightLights = texture2D(nightMap, vUv).rgb;

  // dayFactor: 1 = facing the Sun, 0 = facing away. smoothstep softens the terminator.
  float dayFactor = smoothstep(
    -0.05,
    0.18,
    dot(normalize(vWorldNormal), sunDirection)
  );

  // Soft night fill from the day map so continents remain readable without daylight bleed
  vec3 color = dayColor * (0.09 + 0.91 * dayFactor);
  color += nightLights * (1.0 - dayFactor);

  gl_FragColor = vec4(color, 1.0);
}
`;

function Earth() {
  const earthRef = useRef<Group>(null);
  const { intensity } = useScrollAcceleration();

  const [dayMap, nightMap] = useTexture(
    [...EARTH_TEXTURE_URLS],
    applyColorTextures,
  );

  const uniforms = useMemo(
    () => ({
      dayMap: { value: dayMap },
      nightMap: { value: nightMap },
      sunDirection: { value: SUN_POSITION.clone().normalize() },
    }),
    [dayMap, nightMap],
  );

  useFrame((_, delta) => {
    if (!earthRef.current) return;
    // Up to ~10× when scroll intensity is max — same +Y axis, never reversed
    const speed =
      0.012 * accelerationMultiplier(intensity.current, 10);
    earthRef.current.rotation.y += delta * speed;
  });

  return (
    <group ref={earthRef}>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={earthVertexShader}
          fragmentShader={earthFragmentShader}
        />
      </mesh>
    </group>
  );
}

export default Earth;
