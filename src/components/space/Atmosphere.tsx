/**
 * Soft blue glow on Earth’s silhouette (the “limb”).
 *
 * Technique: another slightly larger sphere whose shader uses a Fresnel term —
 * “how edge-on is this pixel to the camera?” Edges glow; the center stays clear
 * so we do not paint a solid blue bubble over the continents.
 *
 * AdditiveBlending adds light on top of whatever is already drawn (like a glow
 * layer in Photoshop). Night-side rim stays very faint so the outline remains.
 */
import { useMemo } from 'react';
import { AdditiveBlending } from 'three';
import { EARTH_RADIUS, SUN_POSITION } from './earthConfig';

/** Just outside the cloud shell so there is no visible gap / double bubble. */
const ATMOSPHERE_RADIUS = EARTH_RADIUS * 1.015;

const atmosphereVertexShader = /* glsl */ `
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const atmosphereFragmentShader = /* glsl */ `
uniform vec3 sunDirection;

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);

  // High power = glow hugs the outline instead of filling the disk.
  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 5.2);

  float sunFacing = smoothstep(-0.15, 0.7, dot(normal, sunDirection));
  float litRim = mix(0.07, 1.4, sunFacing);

  float intensity = fresnel * litRim;

  vec3 atmosphereColor = mix(
    vec3(0.22, 0.4, 0.8),
    vec3(0.55, 0.82, 1.0),
    sunFacing
  );

  gl_FragColor = vec4(atmosphereColor, intensity);
}
`;

function Atmosphere() {
  const uniforms = useMemo(
    () => ({
      sunDirection: { value: SUN_POSITION.clone().normalize() },
    }),
    [],
  );

  return (
    <mesh>
      <sphereGeometry args={[ATMOSPHERE_RADIUS, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

export default Atmosphere;
