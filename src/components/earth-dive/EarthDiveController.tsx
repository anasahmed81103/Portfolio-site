/**
 * Moves the Three.js camera along the Earth Dive path.
 *
 * Two halves, both driven by diveProgressRef (0→1):
 * 1. Approach (0 → APPROACH_END): Catmull-Rom spline through APPROACH_KEYFRAMES
 *    — a smooth curve that visits each waypoint without stopping.
 * 2. Dive (APPROACH_END → 1): straight slide from the hero shot toward the
 *    glowing limb, never closer than MIN_DIVE_RADIUS so we do not clip Earth.
 *
 * Catmull-Rom is a standard interpolation: given four points, it draws a
 * smooth segment between the middle two. We reuse scratch Vector3s (_pos, …)
 * so we do not allocate new objects every frame (GC jank).
 *
 * `camera.lookAt` aims the lens; `camera.rotateZ(roll)` then banks slightly
 * so the horizon is not perfectly level (more cinematic).
 */
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';
import { diveProgressRef } from '../../hooks/useDiveProgress';
import { EARTH_RADIUS, SUN_POSITION } from '../space/earthConfig';
import {
  APPROACH_END,
  HERO_LOOK_AT,
  HERO_POSITION,
  HERO_ROLL,
} from './earthDivePhases';

type CameraKeyframe = {
  at: number;
  position: readonly [number, number, number];
  lookAt: readonly [number, number, number];
  roll: number;
};

/**
 * Approach path — final pose is the approved hero shot.
 * Keep keys sparse; continuous Catmull-Rom does the smoothing
 * (do NOT ease each segment — that causes the stop-start “jumps”).
 */
const APPROACH_KEYFRAMES: readonly CameraKeyframe[] = [
  { at: 0, position: [0, 0, 12.5], lookAt: [0, 0, 0], roll: 0 },
  { at: 0.28, position: [0.05, 0.02, 10.6], lookAt: [0.01, 0, 0], roll: 0 },
  { at: 0.5, position: [0.22, 0.07, 7.8], lookAt: [0.06, 0.01, -0.02], roll: 0 },
  {
    at: 0.7,
    position: [0.85, 0.16, 5.2],
    lookAt: [0.28, 0.02, -0.1],
    roll: 0.015,
  },
  {
    at: 0.88,
    position: [1.85, 0.26, 3.55],
    lookAt: [0.65, 0.03, -0.4],
    roll: 0.035,
  },
  {
    at: 1,
    position: HERO_POSITION,
    lookAt: HERO_LOOK_AT,
    roll: HERO_ROLL,
  },
];

/**
 * Atmosphere / glowing limb entry point — right-edge horizon where the flare sits.
 * Slightly biased toward the sun so we dive into the bright atmospheric rim.
 */
const LIMB_TARGET = (() => {
  const look = new Vector3(...HERO_LOOK_AT).normalize();
  const sun = SUN_POSITION.clone().normalize();
  look.lerp(sun, 0.22).normalize();
  return look.multiplyScalar(EARTH_RADIUS * 1.02);
})();

/** Minimum camera radius during dive — stay outside the Earth mesh. */
const MIN_DIVE_RADIUS = EARTH_RADIUS * 1.06;

/** How close we finish to the limb (0→1 of hero→limb distance). */
const DIVE_CLOSE_FRACTION = 0.9;

const _pos = new Vector3();
const _look = new Vector3();
const _p0 = new Vector3();
const _p1 = new Vector3();
const _p2 = new Vector3();
const _p3 = new Vector3();
const _heroPos = new Vector3(...HERO_POSITION);
const _heroLook = new Vector3(...HERO_LOOK_AT);
const _diveDir = new Vector3();

/** Furthest travel along the dive ray that keeps the camera outside Earth. */
const MAX_DIVE_TRAVEL = (() => {
  _diveDir.copy(LIMB_TARGET).sub(_heroPos);
  const fullDist = _diveDir.length() || 1;
  _diveDir.multiplyScalar(1 / fullDist);

  const candidate = fullDist * DIVE_CLOSE_FRACTION;
  let safe = 0;

  for (let travel = candidate; travel > 0; travel -= fullDist * 0.004) {
    _pos.copy(_heroPos).addScaledVector(_diveDir, travel);
    if (_pos.length() >= MIN_DIVE_RADIUS) {
      safe = travel;
      break;
    }
  }

  return safe;
})();

/** Ken Perlin’s smootherstep — extra-soft ease in and out (0→1). */
function smootherstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/** Catmull-Rom: continuous velocity through waypoints (no per-segment ease). */
function catmullRom(
  out: Vector3,
  p0: Vector3,
  p1: Vector3,
  p2: Vector3,
  p3: Vector3,
  t: number,
): Vector3 {
  const t2 = t * t;
  const t3 = t2 * t;
  out
    .set(0, 0, 0)
    .addScaledVector(p0, -0.5 * t3 + t2 - 0.5 * t)
    .addScaledVector(p1, 1.5 * t3 - 2.5 * t2 + 1)
    .addScaledVector(p2, -1.5 * t3 + 2 * t2 + 0.5 * t)
    .addScaledVector(p3, 0.5 * t3 - 0.5 * t2);
  return out;
}

function sampleKeyframes(
  keyframes: readonly CameraKeyframe[],
  localT: number,
): { position: Vector3; lookAt: Vector3; roll: number } {
  const p = Math.min(1, Math.max(0, localT));
  const last = keyframes.length - 1;

  let i = 0;
  while (i < last - 1 && keyframes[i + 1].at <= p) {
    i += 1;
  }

  const a = keyframes[i];
  const b = keyframes[Math.min(i + 1, last)];
  const span = b.at - a.at;
  // Linear within the segment — overall progress already eases once
  const t = span <= 0 ? 1 : (p - a.at) / span;

  const i0 = Math.max(0, i - 1);
  const i1 = i;
  const i2 = Math.min(last, i + 1);
  const i3 = Math.min(last, i + 2);

  catmullRom(
    _pos,
    _p0.set(...keyframes[i0].position),
    _p1.set(...keyframes[i1].position),
    _p2.set(...keyframes[i2].position),
    _p3.set(...keyframes[i3].position),
    t,
  );

  catmullRom(
    _look,
    _p0.set(...keyframes[i0].lookAt),
    _p1.set(...keyframes[i1].lookAt),
    _p2.set(...keyframes[i2].lookAt),
    _p3.set(...keyframes[i3].lookAt),
    t,
  );

  return {
    position: _pos,
    lookAt: _look,
    roll: MathUtils.lerp(a.roll, b.roll, t),
  };
}

/**
 * Dive toward the glowing horizon / atmosphere edge.
 * Stops just outside the Earth surface — never penetrates the mesh.
 */
function sampleDiveCamera(diveT: number): {
  position: Vector3;
  lookAt: Vector3;
  roll: number;
} {
  const t = smootherstep01(diveT);

  _diveDir.copy(LIMB_TARGET).sub(_heroPos);
  const fullDist = _diveDir.length() || 1;
  _diveDir.multiplyScalar(1 / fullDist);

  _pos.copy(_heroPos).addScaledVector(_diveDir, MAX_DIVE_TRAVEL * t);
  _look.lerpVectors(_heroLook, LIMB_TARGET, Math.min(1, t * 1.1));

  return {
    position: _pos,
    lookAt: _look,
    roll: MathUtils.lerp(HERO_ROLL, 0.02, t),
  };
}

function sampleCamera(progress: number): {
  position: Vector3;
  lookAt: Vector3;
  roll: number;
} {
  const p = Math.min(1, Math.max(0, progress));

  if (p <= APPROACH_END) {
    // One ease for the whole approach — continuous path, no waypoint stutter
    return sampleKeyframes(
      APPROACH_KEYFRAMES,
      smootherstep01(p / APPROACH_END),
    );
  }

  const diveT = (p - APPROACH_END) / (1 - APPROACH_END);
  return sampleDiveCamera(diveT);
}

function EarthDiveController() {
  const { camera } = useThree();
  const upAxis = useRef(new Vector3(0, 1, 0));

  useFrame(() => {
    const { position, lookAt, roll } = sampleCamera(diveProgressRef.current);

    camera.position.copy(position);
    camera.up.copy(upAxis.current);
    camera.lookAt(lookAt);
    if (roll !== 0) {
      camera.rotateZ(roll);
    }
    camera.updateMatrixWorld();
  });

  return null;
}

export default EarthDiveController;
