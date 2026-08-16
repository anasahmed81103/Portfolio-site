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
 * Calm cinematic path:
 * hold in space → smooth push toward Earth → soft side slide
 * → half Earth / half space on the day-line limb (sun behind the edge).
 */
const KEYFRAMES: readonly CameraKeyframe[] = [
  // A — establishing space shot
  {
    at: 0,
    position: [0, 0, 12.5],
    lookAt: [0, 0, 0],
    roll: 0,
  },
  {
    at: 0.22,
    position: [0, 0, 12.5],
    lookAt: [0, 0, 0],
    roll: 0,
  },
  // B — gentle approach (mostly along Z, tiny drift)
  {
    at: 0.48,
    position: [0.3, 0.1, 5.4],
    lookAt: [0.05, 0, 0],
    roll: 0,
  },
  // C — ease a little to the side as Earth fills the frame
  {
    at: 0.68,
    position: [1.45, 0.22, 3.75],
    lookAt: [0.45, 0.02, -0.2],
    roll: 0.02,
  },
  // D — half Earth / half space, framed on the day-line with sun behind the limb
  {
    at: 0.88,
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

function smoothstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
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
  const localT = span <= 0 ? 1 : smoothstep01((p - a.at) / span);

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
