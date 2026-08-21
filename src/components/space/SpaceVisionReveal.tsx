import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import type { AmbientLight, DirectionalLight } from 'three';
import { SUN_POSITION } from './earthConfig';

/**
 * Staged space entrance: stars are already in the black sky;
 * sunlight / ambient ease up so Earth appears as vision clears.
 */
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

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Let stars settle in the dark first, then Earth resolves into view.
      tl.to(
        ambient,
        {
          intensity: 0.035,
          duration: 1.7,
        },
        0.85,
      );

      tl.to(
        sun,
        {
          intensity: 2.4,
          duration: 2.0,
        },
        1.0,
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
