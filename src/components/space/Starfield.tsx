import { useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  type Group,
  type Points,
} from 'three';
import { useScrollAcceleration } from '../../hooks/useScrollAcceleration.ts';
import { accelerationMultiplier } from '../../hooks/accelerationMultiplier';

/**
 * One unified starfield: small / medium / large all share the same twinkle system.
 * Replaces the old Drei Stars + separate TwinklingStars split.
 */
type StarLayerData = {
  geometry: BufferGeometry;
  phases: Float32Array;
  speeds: Float32Array;
  baseBrightness: Float32Array;
  canFlare: Uint8Array;
  flarePhases: Float32Array;
  flareSpeeds: Float32Array;
  count: number;
};

type LayerConfig = {
  count: number;
  radiusMin: number;
  radiusRange: number;
  speedMin: number;
  speedRange: number;
  brightnessMin: number;
  brightnessRange: number;
  flareChance: number;
  flareSpeedMin: number;
  flareSpeedRange: number;
  pointSize: number;
  driftBase: number;
};

function createStarLayer(config: LayerConfig): StarLayerData {
  const { count } = config;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  const baseBrightness = new Float32Array(count);
  const canFlare = new Uint8Array(count);
  const flarePhases = new Float32Array(count);
  const flareSpeeds = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const radius = config.radiusMin + Math.random() * config.radiusRange;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const i3 = i * 3;
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    phases[i] = Math.random() * Math.PI * 2;
    speeds[i] = config.speedMin + Math.random() * config.speedRange;
    baseBrightness[i] =
      config.brightnessMin + Math.random() * config.brightnessRange;

    canFlare[i] = Math.random() < config.flareChance ? 1 : 0;
    flarePhases[i] = Math.random() * Math.PI * 2;
    flareSpeeds[i] =
      config.flareSpeedMin + Math.random() * config.flareSpeedRange;

    colors[i3] = baseBrightness[i];
    colors[i3 + 1] = baseBrightness[i];
    colors[i3 + 2] = baseBrightness[i];
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));

  return {
    geometry,
    phases,
    speeds,
    baseBrightness,
    canFlare,
    flarePhases,
    flareSpeeds,
    count,
  };
}

function updateLayerTwinkle(
  layer: StarLayerData,
  time: number,
  shimmerStrength: number,
  flarePower: number,
  flareBoost: number,
) {
  const colorAttr = layer.geometry.getAttribute('color');
  const colors = colorAttr.array as Float32Array;

  for (let i = 0; i < layer.count; i += 1) {
    const phase = layer.phases[i];
    const speed = layer.speeds[i];

    const primary = Math.sin(time * speed + phase);
    const secondary = Math.sin(time * speed * 1.65 + phase * 1.3);
    const shimmer =
      1 -
      shimmerStrength +
      shimmerStrength * (0.55 * primary + 0.25 * secondary + 0.2);

    let flare = 0;
    if (layer.canFlare[i] === 1) {
      const wave = Math.sin(time * layer.flareSpeeds[i] + layer.flarePhases[i]);
      flare = Math.max(0, wave) ** flarePower * flareBoost;
    }

    const brightness = Math.min(1, layer.baseBrightness[i] * shimmer + flare);
    const i3 = i * 3;
    colors[i3] = brightness;
    colors[i3 + 1] = brightness;
    colors[i3 + 2] = brightness * 0.96;
  }

  colorAttr.needsUpdate = true;
}

const SMALL_CONFIG: LayerConfig = {
  count: 4800,
  radiusMin: 35,
  radiusRange: 70,
  speedMin: 0.8,
  speedRange: 1.2,
  brightnessMin: 0.35,
  brightnessRange: 0.45,
  flareChance: 0.35,
  flareSpeedMin: 0.3,
  flareSpeedRange: 0.5,
  pointSize: 0.07,
  driftBase: 0.0003,
};

const MEDIUM_CONFIG: LayerConfig = {
  count: 1100,
  radiusMin: 30,
  radiusRange: 60,
  speedMin: 0.55,
  speedRange: 0.9,
  brightnessMin: 0.5,
  brightnessRange: 0.4,
  flareChance: 0.5,
  flareSpeedMin: 0.25,
  flareSpeedRange: 0.45,
  pointSize: 0.14,
  driftBase: 0.0005,
};

const LARGE_CONFIG: LayerConfig = {
  count: 200,
  radiusMin: 26,
  radiusRange: 50,
  speedMin: 0.4,
  speedRange: 0.7,
  brightnessMin: 0.65,
  brightnessRange: 0.3,
  flareChance: 0.75,
  flareSpeedMin: 0.2,
  flareSpeedRange: 0.4,
  pointSize: 0.28,
  driftBase: 0.0008,
};

function StarPointsLayer({
  data,
  pointSize,
  groupRef,
}: {
  data: StarLayerData;
  pointSize: number;
  groupRef: RefObject<Group | null>;
}) {
  const pointsRef = useRef<Points>(null);

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={data.geometry} frustumCulled={false}>
        <pointsMaterial
          size={pointSize}
          sizeAttenuation
          vertexColors
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}

function Starfield() {
  const smallGroupRef = useRef<Group>(null);
  const mediumGroupRef = useRef<Group>(null);
  const largeGroupRef = useRef<Group>(null);
  const animTimeRef = useRef(0);
  const { intensity } = useScrollAcceleration();

  const layers = useMemo(
    () => ({
      small: createStarLayer(SMALL_CONFIG),
      medium: createStarLayer(MEDIUM_CONFIG),
      large: createStarLayer(LARGE_CONFIG),
    }),
    [],
  );

  useFrame((_, delta) => {
    const scroll = intensity.current;
    const driftBoost = accelerationMultiplier(scroll, 25);

    // Same-direction drift for all tiers
    if (smallGroupRef.current) {
      smallGroupRef.current.rotation.y +=
        delta * SMALL_CONFIG.driftBase * driftBoost;
    }
    if (mediumGroupRef.current) {
      mediumGroupRef.current.rotation.y +=
        delta * MEDIUM_CONFIG.driftBase * driftBoost;
    }
    if (largeGroupRef.current) {
      largeGroupRef.current.rotation.y +=
        delta * LARGE_CONFIG.driftBase * driftBoost;
    }

    // Shared anim clock — scroll makes every size tier twinkle faster
    animTimeRef.current += delta * (1 + scroll * 5);
    const time = animTimeRef.current;

    const shimmerBoost = scroll * 0.35;
    const flarePowerDrop = scroll * 2.2;
    const flareAmp = scroll * 1.25;

    updateLayerTwinkle(
      layers.small,
      time,
      0.5 + shimmerBoost,
      6 - flarePowerDrop,
      1.0 + flareAmp,
    );
    updateLayerTwinkle(
      layers.medium,
      time,
      0.6 + shimmerBoost,
      5.5 - flarePowerDrop,
      1.15 + flareAmp,
    );
    // Large stars: strongest breathe + shine so they clearly brighten and sparkle
    updateLayerTwinkle(
      layers.large,
      time,
      0.75 + shimmerBoost * 0.8,
      5 - flarePowerDrop,
      1.4 + flareAmp,
    );
  });

  return (
    <>
      <StarPointsLayer
        data={layers.small}
        pointSize={SMALL_CONFIG.pointSize}
        groupRef={smallGroupRef}
      />
      <StarPointsLayer
        data={layers.medium}
        pointSize={MEDIUM_CONFIG.pointSize}
        groupRef={mediumGroupRef}
      />
      <StarPointsLayer
        data={layers.large}
        pointSize={LARGE_CONFIG.pointSize}
        groupRef={largeGroupRef}
      />
    </>
  );
}

export default Starfield;
