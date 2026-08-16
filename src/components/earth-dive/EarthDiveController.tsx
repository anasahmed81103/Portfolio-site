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

/** Phase 1 — approach to the approved hero horizon. */
const APPROACH_KEYFRAMES: readonly CameraKeyframe[] = [
  { at: 0, position: [0, 0, 12.5], lookAt: [0, 0, 0], roll: 0 },
  { at: 0.16, position: [0, 0, 12.5], lookAt: [0, 0, 0], roll: 0 },
  { at: 0.3, position: [0.08, 0.03, 10.2], lookAt: [0.02, 0, 0], roll: 0 },
  { at: 0.42, position: [0.18, 0.06, 8.1], lookAt: [0.04, 0, 0], roll: 0 },
  { at: 0.52, position: [0.35, 0.1, 6.4], lookAt: [0.1, 0.01, -0.02], roll: 0 },
  {
    at: 0.62,
    position: [0.75, 0.15, 5.05],
    lookAt: [0.25, 0.02, -0.08],
    roll: 0.01,
  },
  {
    at: 0.72,
    position: [1.25, 0.2, 4.05],
    lookAt: [0.4, 0.02, -0.18],
    roll: 0.02,
  },
  {
    at: 0.82,
    position: [1.85, 0.26, 3.35],
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
  // Mostly the hero limb aim, nudged toward the sunlit atmosphere edge
  look.lerp(sun, 0.22).normalize();
  return look.multiplyScalar(EARTH_RADIUS * 1.02);
})();

/** How close we finish to the limb (0→1 of hero→limb distance). */
const DIVE_CLOSE_FRACTION = 0.9;

const _pos = new Vector3();
const _look = new Vector3();
const _fromPos = new Vector3();
const _toPos = new Vector3();
const _fromLook = new Vector3();
const _toLook = new Vector3();
const _heroPos = new Vector3(...HERO_POSITION);
const _heroLook = new Vector3(...HERO_LOOK_AT);
const _diveEnd = new Vector3();
const _diveDir = new Vector3();

function smootherstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function sampleKeyframes(
  keyframes: readonly CameraKeyframe[],
  localT: number,
): { position: Vector3; lookAt: Vector3; roll: number } {
  const p = Math.min(1, Math.max(0, localT));

  let i = 0;
  while (i < keyframes.length - 2 && keyframes[i + 1].at <= p) {
    i += 1;
  }

  const a = keyframes[i];
  const b = keyframes[Math.min(i + 1, keyframes.length - 1)];
  const span = b.at - a.at;
  const t = span <= 0 ? 1 : smootherstep01((p - a.at) / span);

  _fromPos.set(...a.position);
  _toPos.set(...b.position);
  _pos.lerpVectors(_fromPos, _toPos, t);

  _fromLook.set(...a.lookAt);
  _toLook.set(...b.lookAt);
  _look.lerpVectors(_fromLook, _toLook, t);

  return {
    position: _pos,
    lookAt: _look,
    roll: MathUtils.lerp(a.roll, b.roll, t),
  };
}

/**
 * Dive toward the glowing horizon / atmosphere edge.
 * Ends close to the limb — a natural handoff into a future atmosphere scene.
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

  // End just outside the atmosphere shell, looking into the bright rim
  _diveEnd.copy(_heroPos).addScaledVector(_diveDir, fullDist * DIVE_CLOSE_FRACTION);

  _pos.lerpVectors(_heroPos, _diveEnd, t);
  // Look shifts from hero framing onto the limb glow / flare
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
    return sampleKeyframes(APPROACH_KEYFRAMES, p / APPROACH_END);
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
