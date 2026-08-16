import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';
import { diveProgressRef } from '../../hooks/useDiveProgress';

type CameraKeyframe = {
  at: number;
  position: readonly [number, number, number];
  lookAt: readonly [number, number, number];
  /** Tiny bank only — keep the shot calm */
  roll: number;
};

/**
 * Same approved composition (space → close → side → hero limb),
 * but with smaller steps so the path feels slower and less clunky.
 */
const KEYFRAMES: readonly CameraKeyframe[] = [
  // Establishing space shot
  {
    at: 0,
    position: [0, 0, 12.5],
    lookAt: [0, 0, 0],
    roll: 0,
  },
  {
    at: 0.16,
    position: [0, 0, 12.5],
    lookAt: [0, 0, 0],
    roll: 0,
  },
  // Very slow push-in
  {
    at: 0.3,
    position: [0.08, 0.03, 10.2],
    lookAt: [0.02, 0, 0],
    roll: 0,
  },
  {
    at: 0.42,
    position: [0.18, 0.06, 8.1],
    lookAt: [0.04, 0, 0],
    roll: 0,
  },
  {
    at: 0.52,
    position: [0.35, 0.1, 6.4],
    lookAt: [0.1, 0.01, -0.02],
    roll: 0,
  },
  // Soft side slide begins
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
  // Hero limb composition (unchanged payoff pose)
  {
    at: 0.92,
    position: [2.45, 0.32, 2.95],
    lookAt: [0.9, 0.04, -0.7],
    roll: 0.05,
  },
  // Hold the final frame so the end doesn't feel abrupt
  {
    at: 1,
    position: [2.45, 0.32, 2.95],
    lookAt: [0.9, 0.04, -0.7],
    roll: 0.05,
  },
];

const _pos = new Vector3();
const _look = new Vector3();
const _fromPos = new Vector3();
const _toPos = new Vector3();
const _fromLook = new Vector3();
const _toLook = new Vector3();

/** Quintic smootherstep — softer than smoothstep at the segment ends. */
function smootherstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function sampleCamera(progress: number): {
  position: Vector3;
  lookAt: Vector3;
  roll: number;
} {
  const p = Math.min(1, Math.max(0, progress));

  let i = 0;
  while (i < KEYFRAMES.length - 2 && KEYFRAMES[i + 1].at <= p) {
    i += 1;
  }

  const a = KEYFRAMES[i];
  const b = KEYFRAMES[Math.min(i + 1, KEYFRAMES.length - 1)];
  const span = b.at - a.at;
  const localT = span <= 0 ? 1 : smootherstep01((p - a.at) / span);

  _fromPos.set(...a.position);
  _toPos.set(...b.position);
  _pos.lerpVectors(_fromPos, _toPos, localT);

  _fromLook.set(...a.lookAt);
  _toLook.set(...b.lookAt);
  _look.lerpVectors(_fromLook, _toLook, localT);

  const roll = MathUtils.lerp(a.roll, b.roll, localT);

  return { position: _pos, lookAt: _look, roll };
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
