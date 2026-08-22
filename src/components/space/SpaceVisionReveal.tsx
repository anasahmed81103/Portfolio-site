/**
 * Lights for the orbital scene, plus the “eyes adjusting to space” fade-in.
 *
 * GSAP (GreenSock) is the animation library. A `timeline` is a sequence:
 * “at 2.4s start raising ambient; at 2.65s start raising the Sun.”
 * Stars (Starfield) are already visible, so Earth appears later — cinematic.
 *
 * These lights stay mounted when Space becomes Earth Dive so intensity
 * does not pop back to zero (no remount).
 *
 * `gsap.context` + `ctx.revert()` on cleanup is the official React pattern:
 * if the component unmounts mid-tween, GSAP kills those tweens.
 */
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import type { AmbientLight, DirectionalLight } from 'three';
import { SUN_POSITION } from './earthConfig';

function SpaceVisionReveal() {
  const ambientRef = useRef<AmbientLight>(null);
  const sunRef = useRef<DirectionalLight>(null);

  useLayoutEffect(() => {
    const ambient = ambientRef.current;
    const sun = sunRef.current;
    if (!ambient || !sun) return;

    const ctx = gsap.context(() => {
      gsap.set(ambient, { intensity: 0 });
      gsap.set(sun, { intensity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } });

      tl.to(
        ambient,
        {
          intensity: 0.035,
          duration: 2.6,
          ease: 'power1.inOut',
        },
        2.4,
      );

      tl.to(
        sun,
        {
          intensity: 2.4,
          duration: 3.0,
          ease: 'power1.inOut',
        },
        2.65,
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0} />
      <directionalLight
        ref={sunRef}
        position={SUN_POSITION.toArray()}
        intensity={0}
        color="#fff2dd"
      />
    </>
  );
}

export default SpaceVisionReveal;
