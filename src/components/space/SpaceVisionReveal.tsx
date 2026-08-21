import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import type { AmbientLight, DirectionalLight } from 'three';
import { SUN_POSITION } from './earthConfig';

/**
 * Staged space entrance: stars shimmer in the dark first;
 * sunlight / ambient ease up much later so Earth resolves gently.
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

      const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } });

      // Earth waits until stars have already been shimmering awhile.
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
