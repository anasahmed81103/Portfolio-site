/**
 * Thin cloud shell around Earth — another sphere, slightly larger.
 *
 * The cloud JPEG has no alpha channel. We treat brightness as opacity:
 * dark pixels = clear sky, bright pixels = cloud. The `dot(..., 0.299, 0.587, 0.114)`
 * is the standard luminance formula (how bright a color looks to the eye).
 *
 * `transparent` + `depthWrite={false}` lets the planet show through gaps
 * without fighting the depth buffer (which would make holes look like holes
 * punched in a solid ball).
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import type { Mesh, Texture } from 'three';
import { EARTH_RADIUS } from './earthConfig';
import {
  useScrollAcceleration,
} from '../../hooks/useScrollAcceleration.ts';
import { accelerationMultiplier } from '../../hooks/accelerationMultiplier';
import { planetYawDriveRef } from '../../hooks/planetYawDrive';
import { EARTH_TEXTURES } from '../../preload/sessionAssets';

/** A hair larger than Earth so clouds sit in a shell, not z-fighting the surface. */
const CLOUD_RADIUS = EARTH_RADIUS * 1.012;

const cloudVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const cloudFragmentShader = /* glsl */ `
uniform sampler2D cloudMap;

varying vec2 vUv;

void main() {
  vec3 cloudColor = texture2D(cloudMap, vUv).rgb;
  float alpha = dot(cloudColor, vec3(0.299, 0.587, 0.114));
  alpha = smoothstep(0.05, 0.65, alpha) * 0.55;

  gl_FragColor = vec4(vec3(1.0), alpha);
}
`;

function CloudLayer() {
  const cloudRef = useRef<Mesh>(null);
  const { intensity } = useScrollAcceleration();
  const cloudMap = useTexture(EARTH_TEXTURES.clouds) as Texture;

  const uniforms = useMemo(
    () => ({
      cloudMap: { value: cloudMap },
    }),
    [cloudMap],
  );

  useFrame((_, delta) => {
    if (!cloudRef.current) return;

    // Same yaw lock as Earth during dive; slightly faster drift in Space.
    if (planetYawDriveRef.current !== null) {
      cloudRef.current.rotation.y = planetYawDriveRef.current;
    } else {
      const speed =
        0.018 * accelerationMultiplier(intensity.current, 11);
      cloudRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <mesh ref={cloudRef}>
      <sphereGeometry args={[CLOUD_RADIUS, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={cloudVertexShader}
        fragmentShader={cloudFragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default CloudLayer;
