import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import SpaceScene from './space/SpaceScene';
import {
  scrollIntensityRef,
  scrollTargetRef,
} from '../hooks/useScrollAcceleration.ts';

function SpaceExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const onWheel = (event: WheelEvent) => {
      // Direction ignored — only scroll magnitude builds acceleration
      const burst = Math.min(0.32, Math.abs(event.deltaY) / 280);
      scrollTargetRef.current = Math.min(1, scrollTargetRef.current + burst);
    };

    root.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      root.removeEventListener('wheel', onWheel);
      scrollTargetRef.current = 0;
      scrollIntensityRef.current = 0;
    };
  }, []);

  return (
    <div ref={containerRef} className="space-experience">
      <Canvas
        // Establishing shot: farther back so Earth fills ~40% of viewport height
        camera={{ position: [0, 0, 12.5], fov: 38, near: 0.1, far: 400 }}
      >
        <color attach="background" args={['#000000']} />
        <SpaceScene />
      </Canvas>
    </div>
  );
}

export default SpaceExperience;
