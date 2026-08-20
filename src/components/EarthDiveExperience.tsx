import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import EarthDiveScene from './earth-dive/EarthDiveScene';
import EarthDiveProgressTicker from './earth-dive/EarthDiveProgressTicker';
import {
  scrollIntensityRef,
  scrollTargetRef,
} from '../hooks/useScrollAcceleration.ts';
import {
  ACCEL_HANDOFF_END,
  ACCEL_HANDOFF_START,
  diveProgressRef,
  diveTargetRef,
} from '../hooks/useDiveProgress';
import {
  APPROACH_END,
  earthRotationProgressRef,
  earthSpinAccumRef,
  earthSpinGateOpenRef,
  isBookHandoffReady,
} from './earth-dive/earthDivePhases';
import { planetYawDriveRef } from '../hooks/planetYawDrive';

/** Slower scrub while closing in from space — soft, cinematic approach. */
const APPROACH_WHEEL_SCALE = 0.00028;

/** Dive / flash scrub (after hero lock). */
const DIVE_WHEEL_SCALE = 0.00055;

/** Extra wheel burst while hero-locked — spin gate unlocks sooner. */
const SPIN_WHEEL_BURST_SCALE = 2.4;

/** Same SpaceExperience wheel → acceleration burst. */
function feedSpaceAcceleration(deltaY: number, burstScale = 1) {
  const burst =
    Math.min(0.32, Math.abs(deltaY) / 280) * burstScale;
  scrollTargetRef.current = Math.min(1, scrollTargetRef.current + burst);
}

/** Smooth handoff weight during early approach only. */
function accelerationHandoffWeight(progress: number): number {
  if (progress <= ACCEL_HANDOFF_START) return 1;
  if (progress >= ACCEL_HANDOFF_END) return 0;
  const t =
    (progress - ACCEL_HANDOFF_START) /
    (ACCEL_HANDOFF_END - ACCEL_HANDOFF_START);
  return 1 - t * t * (3 - 2 * t);
}

function BookHandoffBridge({ onBookHandoff }: { onBookHandoff?: () => void }) {
  const firedRef = useRef(false);

  useFrame(() => {
    if (firedRef.current || !onBookHandoff) return;
    if (isBookHandoffReady()) {
      firedRef.current = true;
      onBookHandoff();
    }
  });

  return null;
}

type EarthDiveExperienceProps = {
  onBookHandoff?: () => void;
};

function EarthDiveExperience({ onBookHandoff }: EarthDiveExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const onWheel = (event: WheelEvent) => {
      const target = diveTargetRef.current;
      const atHero = target >= APPROACH_END - 0.0001;
      const gateOpen = earthSpinGateOpenRef.current;

      // --- Phase 1: approach toward hero ---
      if (!atHero) {
        diveTargetRef.current = Math.min(
          APPROACH_END,
          Math.max(0, target + event.deltaY * APPROACH_WHEEL_SCALE),
        );
        const weight = accelerationHandoffWeight(diveProgressRef.current);
        if (weight > 0.001) {
          const burst =
            Math.min(0.32, Math.abs(event.deltaY) / 280) * weight;
          scrollTargetRef.current = Math.min(
            1,
            scrollTargetRef.current + burst,
          );
        }
        return;
      }

      // --- Phase 2: hero lock — short Space-style spin, then dive unlocks ---
      if (!gateOpen) {
        if (event.deltaY < 0 && earthRotationProgressRef.current < 0.02) {
          diveTargetRef.current = Math.min(
            APPROACH_END,
            Math.max(0, target + event.deltaY * APPROACH_WHEEL_SCALE),
          );
          return;
        }
        feedSpaceAcceleration(event.deltaY, SPIN_WHEEL_BURST_SCALE);
        diveTargetRef.current = APPROACH_END;
        return;
      }

      // --- Phase 3: limb dive → solar flash → Book ---
      feedSpaceAcceleration(event.deltaY, 1);
      diveTargetRef.current = Math.min(
        1,
        Math.max(APPROACH_END, target + event.deltaY * DIVE_WHEEL_SCALE),
      );
    };

    root.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      root.removeEventListener('wheel', onWheel);
      diveTargetRef.current = 0;
      diveProgressRef.current = 0;
      earthRotationProgressRef.current = 0;
      earthSpinAccumRef.current = 0;
      earthSpinGateOpenRef.current = false;
      planetYawDriveRef.current = null;
      scrollTargetRef.current = 0;
      scrollIntensityRef.current = 0;
    };
  }, []);

  return (
    <div ref={containerRef} className="earth-dive-experience">
      <Canvas
        camera={{ position: [0, 0, 12.5], fov: 38, near: 0.1, far: 400 }}
      >
        <color attach="background" args={['#000000']} />
        <EarthDiveProgressTicker />
        <BookHandoffBridge onBookHandoff={onBookHandoff} />
        <EarthDiveScene />
      </Canvas>
    </div>
  );
}

export default EarthDiveExperience;
