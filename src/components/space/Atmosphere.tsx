import { useMemo } from 'react';
import { AdditiveBlending } from 'three';
import { EARTH_RADIUS, SUN_POSITION } from './earthConfig';

/**
 * Just outside the cloud shell (1.012) so the glow sits on the limb,
 * not in a visible gap as a separate bubble.
 */
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

  // High power keeps the glow tight to the silhouette (less “bubble” fill)
  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 5.2);

  // Day limb bright; night limb keeps a faint residual so the silhouette stays readable
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
