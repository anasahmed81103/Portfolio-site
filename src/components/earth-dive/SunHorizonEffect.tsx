import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  AdditiveBlending,
  CanvasTexture,
  MathUtils,
  Sprite,
  SpriteMaterial,
  Vector3,
} from 'three';
import { EARTH_RADIUS, SUN_POSITION } from '../space/earthConfig';

/** Soft procedural glow — no external image assets. */
function createGlowTexture(
  stops: readonly (readonly [number, string])[],
  size = 128,
): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  const mid = size * 0.5;
  const gradient = ctx.createRadialGradient(mid, mid, 0, mid, mid, mid);
  for (const [t, color] of stops) {
    gradient.addColorStop(t, color);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Must match EarthDiveController hero keyframe D.
 * Used only to measure how close the live camera is — does not move the camera.
 */
const HERO_CAMERA_POSITION = new Vector3(2.45, 0.32, 2.95);

/** Start building while the camera is still approaching (before the final pose). */
const EFFECT_START_DISTANCE = 3.4;
/** Full peak when the camera has essentially arrived at the hero pose. */
const EFFECT_PEAK_DISTANCE = 0.04;

/**
 * 0 = still far from the hero shot, 1 = camera is at the final hero position.
 * Extra scroll after the camera stops does NOT keep increasing this.
 */
function cameraApproach(cameraPosition: Vector3): number {
  const dist = cameraPosition.distanceTo(HERO_CAMERA_POSITION);
  return 1 - smoothstep(EFFECT_PEAK_DISTANCE, EFFECT_START_DISTANCE, dist);
}

/**
 * Layer ramps from camera approach (not diveProgress / scroll).
 * Flare leads early; everything peaks only when approach → 1.
 */
function layerStrengths(approach: number) {
  const horizonBlue =
    smoothstep(0, 0.4, approach) * 0.25 +
    smoothstep(0.25, 1, approach) * 0.75;

  const warm = smoothstep(0.18, 1, approach);
  const sun = smoothstep(0.28, 1, approach);

  // Flare starts earliest, then climbs through the rest of the approach
  const flare =
    smoothstep(0, 0.4, approach) * 0.35 +
    smoothstep(0.35, 1, approach) * 0.65;

  const finale = smoothstep(0.65, 1, approach);

  return { horizonBlue, warm, sun, flare, finale };
}

function makeSpriteMaterial(
  map: CanvasTexture,
  depthTest: boolean,
): SpriteMaterial {
  return new SpriteMaterial({
    map,
    transparent: true,
    depthWrite: false,
    depthTest,
    blending: AdditiveBlending,
    opacity: 0,
    toneMapped: false,
  });
}

const _sunDir = new Vector3();
const _limbGlow = new Vector3();
const _sunPos = new Vector3();
const _toCam = new Vector3();
const _viewDir = new Vector3();

type LayerRefs = {
  core: Sprite | null;
  corona: Sprite | null;
  horizonBlue: Sprite | null;
  horizonWarm: Sprite | null;
  warmScatter: Sprite | null;
  flareGlow: Sprite | null;
  flareStreak: Sprite | null;
};

/**
 * Cinematic Sun + localized horizon bloom for Earth Dive only.
 * Driven by live camera position relative to the hero pose.
 */
function SunHorizonEffect() {
  const { camera } = useThree();
  const layers = useRef<LayerRefs>({
    core: null,
    corona: null,
    horizonBlue: null,
    horizonWarm: null,
    warmScatter: null,
    flareGlow: null,
    flareStreak: null,
  });

  const assets = useMemo(() => {
    const softWhite = createGlowTexture([
      [0, 'rgba(255,255,255,1)'],
      [0.12, 'rgba(255,252,240,1)'],
      [0.32, 'rgba(255,230,160,0.45)'],
      [0.65, 'rgba(255,190,90,0.12)'],
      [1, 'rgba(255,170,60,0)'],
    ]);
    const softCyan = createGlowTexture([
      [0, 'rgba(220,245,255,0.9)'],
      [0.35, 'rgba(120,200,255,0.35)'],
      [0.7, 'rgba(60,140,255,0.08)'],
      [1, 'rgba(40,100,255,0)'],
    ]);
    const softWarm = createGlowTexture([
      [0, 'rgba(255,250,230,1)'],
      [0.2, 'rgba(255,220,130,0.55)'],
      [0.48, 'rgba(255,160,70,0.16)'],
      [1, 'rgba(255,110,40,0)'],
    ]);

    return {
      textures: [softWhite, softCyan, softWarm] as const,
      materials: {
        core: makeSpriteMaterial(softWhite, true),
        corona: makeSpriteMaterial(softWhite, true),
        horizonBlue: makeSpriteMaterial(softCyan, true),
        horizonWarm: makeSpriteMaterial(softWarm, true),
        warmScatter: makeSpriteMaterial(softWarm, true),
        flareGlow: makeSpriteMaterial(softWhite, false),
        flareStreak: makeSpriteMaterial(softWarm, false),
      },
    };
  }, []);

  useEffect(() => {
    const { textures, materials } = assets;
    return () => {
      for (const texture of textures) {
        texture.dispose();
      }
      for (const material of Object.values(materials)) {
        material.dispose();
      }
    };
  }, [assets]);

  useFrame(() => {
    const approach = cameraApproach(camera.position);
    const { horizonBlue, warm, sun, flare, finale } = layerStrengths(approach);
    const anyVisible = horizonBlue > 0.01 || sun > 0.01 || flare > 0.01;

    _sunDir.copy(SUN_POSITION).normalize();

    // Glow sits on the atmosphere limb (sun-facing side only)
    _limbGlow.copy(_sunDir).multiplyScalar(EARTH_RADIUS * 1.02);

    // Visual sun along the real sun ray, just outside the surface…
    _sunPos.copy(_sunDir).multiplyScalar(EARTH_RADIUS * 1.05);
    // …then pull it AWAY from the camera so Earth occludes it.
    // Early: deeply hidden. Late: barely offset → peeks past the limb.
    _toCam.copy(camera.position).sub(_sunPos).normalize();
    const hideBehind = MathUtils.lerp(0.62, 0.04, sun);
    _sunPos.addScaledVector(_toCam, -hideBehind);

    camera.getWorldDirection(_viewDir);
    const facing = Math.max(
      0,
      -_viewDir.dot(_toCam.copy(camera.position).sub(_sunPos).normalize()),
    );
    const flareBoost = smoothstep(0.5, 0.9, facing);

    const {
      core,
      corona,
      horizonBlue: horizonBlueSprite,
      horizonWarm,
      warmScatter,
      flareGlow,
      flareStreak,
    } = layers.current;

    const placeAt = (
      sprite: Sprite | null,
      pos: Vector3,
      scaleX: number,
      scaleY: number,
      visible: boolean,
    ) => {
      if (!sprite) return;
      sprite.visible = visible;
      sprite.position.copy(pos);
      sprite.scale.set(scaleX, scaleY, 1);
    };

    const setOpacity = (sprite: Sprite | null, opacity: number) => {
      if (!sprite) return;
      (sprite.material as SpriteMaterial).opacity = opacity;
    };

    // --- Horizon bloom (limb) ---
    placeAt(
      horizonBlueSprite,
      _limbGlow,
      1.7 + horizonBlue * 0.55,
      0.65 + horizonBlue * 0.25,
      anyVisible,
    );
    placeAt(
      horizonWarm,
      _limbGlow,
      1.15 + warm * 0.55,
      0.48 + warm * 0.22,
      warm > 0.01,
    );
    placeAt(
      warmScatter,
      _limbGlow,
      0.75 + warm * 0.45,
      0.75 + warm * 0.45,
      warm > 0.01,
    );

    setOpacity(horizonBlueSprite, horizonBlue * (0.72 + finale * 0.18));
    setOpacity(horizonWarm, warm * (0.72 + finale * 0.22));
    setOpacity(warmScatter, warm * (0.48 + finale * 0.2));

    // --- Sun core / corona ---
    const coreSize = 0.18 + sun * 0.18 + finale * 0.08;
    const coronaSize = 0.55 + sun * 0.85 + finale * 0.35;
    placeAt(core, _sunPos, coreSize, coreSize, sun > 0.02);
    placeAt(corona, _sunPos, coronaSize, coronaSize, sun > 0.02);
    setOpacity(core, Math.min(1, sun * (1.05 + finale * 0.2)));
    setOpacity(corona, sun * (0.62 + finale * 0.28));

    // --- Camera flare — builds with approach, max only at final camera pose ---
    const flareAmount = flare * (0.55 + flareBoost * 0.45);
    placeAt(
      flareGlow,
      _sunPos,
      0.45 + flare * 0.55 + finale * 0.25,
      0.45 + flare * 0.55 + finale * 0.25,
      flareAmount > 0.01,
    );
    placeAt(
      flareStreak,
      _sunPos,
      1.8 + flare * 1.6 + finale * 0.5,
      0.055 + flare * 0.045,
      flareAmount > 0.01,
    );
    setOpacity(flareGlow, flareAmount * (0.42 + finale * 0.22));
    setOpacity(flareStreak, flareAmount * (0.32 + finale * 0.16));
  });

  const { materials } = assets;

  return (
    <group>
      <sprite
        ref={(node) => {
          layers.current.horizonBlue = node;
        }}
        material={materials.horizonBlue}
        renderOrder={2}
      />
      <sprite
        ref={(node) => {
          layers.current.horizonWarm = node;
        }}
        material={materials.horizonWarm}
        renderOrder={3}
      />
      <sprite
        ref={(node) => {
          layers.current.warmScatter = node;
        }}
        material={materials.warmScatter}
        renderOrder={3}
      />

      <sprite
        ref={(node) => {
          layers.current.corona = node;
        }}
        material={materials.corona}
        renderOrder={4}
      />
      <sprite
        ref={(node) => {
          layers.current.core = node;
        }}
        material={materials.core}
        renderOrder={5}
      />

      <sprite
        ref={(node) => {
          layers.current.flareGlow = node;
        }}
        material={materials.flareGlow}
        renderOrder={6}
      />
      <sprite
        ref={(node) => {
          layers.current.flareStreak = node;
        }}
        material={materials.flareStreak}
        renderOrder={6}
      />
    </group>
  );
}

export default SunHorizonEffect;
