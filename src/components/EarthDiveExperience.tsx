import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import EarthDiveScene from './earth-dive/EarthDiveScene';
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
} from './earth-dive/earthDivePhases';
import { planetYawDriveRef } from '../hooks/planetYawDrive';

/** Approach + dive scrub sensitivity (spin phase does NOT use this). */
const DIVE_WHEEL_SCALE = 0.00055;

/** Same SpaceExperience wheel → acceleration burst. */
function feedSpaceAcceleration(deltaY: number) {
  const burst = Math.min(0.32, Math.abs(deltaY) / 280);
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

function EarthDiveExperience() {
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
          Math.max(0, target + event.deltaY * DIVE_WHEEL_SCALE),
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
            Math.max(0, target + event.deltaY * DIVE_WHEEL_SCALE),
          );
          return;
        }
        feedSpaceAcceleration(event.deltaY);
        diveTargetRef.current = APPROACH_END;
        return;
      }

      // --- Phase 3: dive into glowing right limb / atmosphere ---
      // Keep feeding Space-style accel so Earth continues spinning naturally
      feedSpaceAcceleration(event.deltaY);
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
        <EarthDiveScene />
      </Canvas>
    </div>
  );
}

export default EarthDiveExperience;
