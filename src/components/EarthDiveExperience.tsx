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

/** Slightly gentler scrub so the approach feels cinematic, not jumpy. */
const DIVE_WHEEL_SCALE = 0.00095;

/** Smooth handoff weight: 1 = full Space acceleration, 0 = dive-only. */
function accelerationHandoffWeight(progress: number): number {
  if (progress <= ACCEL_HANDOFF_START) return 1;
  if (progress >= ACCEL_HANDOFF_END) return 0;
  const t =
    (progress - ACCEL_HANDOFF_START) /
    (ACCEL_HANDOFF_END - ACCEL_HANDOFF_START);
  // Smoothstep so acceleration eases out instead of cutting off
  return 1 - t * t * (3 - 2 * t);
}

function EarthDiveExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const onWheel = (event: WheelEvent) => {
      // Bidirectional scrub: down advances, up reverses the cinematic timeline
      const next = Math.min(
        1,
        Math.max(0, diveTargetRef.current + event.deltaY * DIVE_WHEEL_SCALE),
      );
      diveTargetRef.current = next;

      // Early in the sequence, also feed Space-style acceleration (fades out)
      const weight = accelerationHandoffWeight(diveProgressRef.current);
      if (weight > 0.001) {
        const burst = Math.min(0.32, Math.abs(event.deltaY) / 280) * weight;
        scrollTargetRef.current = Math.min(
          1,
          scrollTargetRef.current + burst,
        );
      }
    };

    root.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      root.removeEventListener('wheel', onWheel);
      diveTargetRef.current = 0;
      diveProgressRef.current = 0;
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
