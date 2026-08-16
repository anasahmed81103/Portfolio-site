import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  type Points,
} from 'three';

const SMALL_STAR_COUNT = 150;
const LARGE_STAR_COUNT = 45;

type TwinkleLayer = {
  geometry: BufferGeometry;
  phases: Float32Array;
  speeds: Float32Array;
  baseBrightness: Float32Array;
  canFlare: Uint8Array;
  flarePhases: Float32Array;
  flareSpeeds: Float32Array;
  count: number;
};

function createTwinkleLayer(
  count: number,
  options: {
    radiusMin: number;
    radiusRange: number;
    speedMin: number;
    speedRange: number;
    brightnessMin: number;
    brightnessRange: number;
    flareChance: number;
    flareSpeedMin: number;
    flareSpeedRange: number;
  },
): TwinkleLayer {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  const baseBrightness = new Float32Array(count);
  const canFlare = new Uint8Array(count);
  const flarePhases = new Float32Array(count);
  const flareSpeeds = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const radius = options.radiusMin + Math.random() * options.radiusRange;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const i3 = i * 3;
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    phases[i] = Math.random() * Math.PI * 2;
    speeds[i] = options.speedMin + Math.random() * options.speedRange;
    baseBrightness[i] =
      options.brightnessMin + Math.random() * options.brightnessRange;

    canFlare[i] = Math.random() < options.flareChance ? 1 : 0;
    flarePhases[i] = Math.random() * Math.PI * 2;
    flareSpeeds[i] =
      options.flareSpeedMin + Math.random() * options.flareSpeedRange;

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

function updateLayerBrightness(
  layer: TwinkleLayer,
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
    const secondary = Math.sin(time * speed * 1.7 + phase * 1.3);
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

/**
 * Two Points layers: many small shimmering stars + fewer larger ones that
 * brighten, shine, and occasionally flare. Still tiny vs the Drei field.
 */
function TwinklingStars() {
  const smallRef = useRef<Points>(null);
  const largeRef = useRef<Points>(null);

  const layers = useMemo(
    () => ({
      small: createTwinkleLayer(SMALL_STAR_COUNT, {
        radiusMin: 30,
        radiusRange: 55,
        speedMin: 0.7,
        speedRange: 1.1,
        brightnessMin: 0.45,
        brightnessRange: 0.4,
        flareChance: 0.45,
        flareSpeedMin: 0.25,
        flareSpeedRange: 0.45,
      }),
      // Bigger accents — stronger breathe + shine so visitors notice them
      large: createTwinkleLayer(LARGE_STAR_COUNT, {
        radiusMin: 26,
        radiusRange: 50,
        speedMin: 0.45,
        speedRange: 0.75,
        brightnessMin: 0.65,
        brightnessRange: 0.3,
        flareChance: 0.7,
        flareSpeedMin: 0.2,
        flareSpeedRange: 0.4,
      }),
    }),
    [],
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    updateLayerBrightness(layers.small, time, 0.55, 6, 1.1);
    // Larger stars: deeper bright↔dim swing and punchier flares
    updateLayerBrightness(layers.large, time, 0.7, 5, 1.35);
  });

  return (
    <>
      <points
        ref={smallRef}
        geometry={layers.small.geometry}
        frustumCulled={false}
      >
        <pointsMaterial
          size={0.14}
          sizeAttenuation
          vertexColors
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>

      <points
        ref={largeRef}
        geometry={layers.large.geometry}
        frustumCulled={false}
      >
        <pointsMaterial
          size={0.28}
          sizeAttenuation
          vertexColors
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </>
  );
}

export default TwinklingStars;
