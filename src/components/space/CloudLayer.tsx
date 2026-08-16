import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import type { Mesh, Texture } from 'three';
import { EARTH_RADIUS } from './earthConfig';

/** Slightly above the surface so clouds sit in a thin shell, not a second planet. */
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
  // JPG has no alpha — dark = clear sky, bright = cloud (luminance → opacity)
  float alpha = dot(cloudColor, vec3(0.299, 0.587, 0.114));
  alpha = smoothstep(0.05, 0.65, alpha) * 0.55;

  gl_FragColor = vec4(vec3(1.0), alpha);
}
`;

function CloudLayer() {
  const cloudRef = useRef<Mesh>(null);
  const cloudMap = useTexture('/textures/earth/earth-clouds.jpg') as Texture;

  const uniforms = useMemo(
    () => ({
      cloudMap: { value: cloudMap },
    }),
    [cloudMap],
  );

  useFrame((_, delta) => {
    if (!cloudRef.current) return;
    // Same sign as Earth (positive Y), slightly faster so clouds drift ahead
    cloudRef.current.rotation.y += delta * 0.018;
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
