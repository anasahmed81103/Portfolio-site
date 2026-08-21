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
      gsap.set(soft, { opacity: 1 });

      const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } });

      // Phase 1 — peel solid black just enough for stars to shimmer underneath.
      tl.to(
        core,
        {
          opacity: 0.55,
          duration: 1.1,
          ease: 'power1.out',
        },
        0.05,
      );

      // Soft veil opens a dark window so twinkling reads on black.
      tl.to(
        soft,
        {
          opacity: 0.75,
          duration: 1.2,
          ease: 'power1.out',
        },
        0.15,
      );

      // Hold — stars breathe in the dark before the full reveal.
      tl.to({}, { duration: 0.55 });

      // Phase 2 — slow vision clear; stars already alive.
      tl.to(
        core,
        {
          opacity: 0,
          duration: 2.4,
          ease: 'power1.inOut',
        },
        '>-0.05',
      );

      tl.to(
        soft,
        {
          opacity: 0,
          duration: 2.8,
          ease: 'power1.inOut',
        },
        '<0.25',
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

      <div ref={veilRef} className="space-vision-veil" aria-hidden="true">
        <div className="space-vision-veil-core" />
        <div className="space-vision-veil-soft" />
      </div>
    </div>
  );
}

export default SpaceExperience;
