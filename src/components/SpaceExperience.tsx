import { useLayoutEffect, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import SpaceScene from './space/SpaceScene';
import {
  scrollIntensityRef,
  scrollTargetRef,
} from '../hooks/useScrollAcceleration.ts';

function SpaceExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const veil = veilRef.current;
    if (!veil) return;

    const core = veil.querySelector<HTMLElement>('.space-vision-veil-core');
    const soft = veil.querySelector<HTMLElement>('.space-vision-veil-soft');

    const ctx = gsap.context(() => {
      gsap.set(veil, { opacity: 1 });
      gsap.set(core, { opacity: 1 });
      gsap.set(soft, { opacity: 0.95 });

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Solid night lifts → stars bloom in clear darkness.
      tl.to(
        core,
        {
          opacity: 0,
          duration: 1.35,
        },
        0.1,
      );

      // Soft vignette clears slower — like eyes adjusting, Earth still dark under lights.
      tl.to(
        soft,
        {
          opacity: 0,
          duration: 1.8,
        },
        0.45,
      );

      tl.set(veil, { display: 'none' });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const onWheel = (event: WheelEvent) => {
      const burst = Math.min(0.32, Math.abs(event.deltaY) / 280);
      const signedBurst = event.deltaY < 0 ? -burst : burst;
      scrollTargetRef.current = Math.max(
        -1,
        Math.min(1, scrollTargetRef.current + signedBurst),
      );
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
        camera={{ position: [0, 0, 12.5], fov: 38, near: 0.1, far: 400 }}
      >
        <color attach="background" args={['#000000']} />
        <SpaceScene />
      </Canvas>

      {/* Full black → clear: stars appear first while Earth is still unlit */}
      <div ref={veilRef} className="space-vision-veil" aria-hidden="true">
        <div className="space-vision-veil-core" />
        <div className="space-vision-veil-soft" />
      </div>
    </div>
  );
}

export default SpaceExperience;
