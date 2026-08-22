/**
 * The planet mesh: a sphere with a custom GLSL shader (not a stock material).
 *
 * Libraries:
 * - @react-three/fiber `useFrame` — run code every rendered frame (~60fps)
 * - @react-three/drei `useTexture` — load JPEGs from /public into GPU textures
 * - Three.js ShaderMaterial — we write the lighting ourselves
 *
 * Why a custom shader? We blend a day map and a night-lights map based on
 * which side of the globe faces the Sun (the “terminator” line).
 *
 * GLSL (OpenGL Shading Language) runs on the GPU:
 * - vertex shader: runs once per vertex, passes UV + world normal onward
 * - fragment shader: runs once per pixel, picks the color
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { SRGBColorSpace, type Group, type Texture } from 'three';
import { EARTH_RADIUS, SUN_POSITION } from './earthConfig';
import {
  useScrollAcceleration,
} from '../../hooks/useScrollAcceleration.ts';
import { accelerationMultiplier } from '../../hooks/accelerationMultiplier';
import {
  earthYawReadRef,
  planetYawDriveRef,
} from '../../hooks/planetYawDrive';

const EARTH_TEXTURE_URLS = [
  '/textures/earth/earth-day.jpg',
  '/textures/earth/earth-night.jpg',
] as const;

/** JPEGs are authored in sRGB — tell Three.js so colors are not washed out. */
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
  // World-space normal so lighting does not flip when the planet rotates.
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

  // 1 = facing the Sun, 0 = facing away. smoothstep softens the day/night edge.
  float dayFactor = smoothstep(
    -0.05,
    0.18,
    dot(normalize(vWorldNormal), sunDirection)
  );

  // Keep a faint day-map fill on the night side so continents stay readable.
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

  // Uniforms are values the CPU sends to the GPU shader each frame.
  // useMemo keeps the object identity stable so the material is not rebuilt.
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

    // Dive chapter: another component owns yaw. Space: we spin ourselves.
    // `delta` is seconds since the last frame, so speed stays FPS-independent.
    if (planetYawDriveRef.current !== null) {
      earthRef.current.rotation.y = planetYawDriveRef.current;
    } else {
      const speed =
        0.012 * accelerationMultiplier(intensity.current, 10);
      earthRef.current.rotation.y += delta * speed;
    }

    earthYawReadRef.current = earthRef.current.rotation.y;
  });

  return (
    <group ref={earthRef}>
      <mesh>
        {/* 64×64 segments = smooth sphere without being too heavy. */}
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
