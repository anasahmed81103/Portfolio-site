import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import IntroPlaneSvg from './IntroPlaneSvg';
import { playLoop, playTransitionOnce } from '../../audio/stageAudio';

type IntroSpaceHandoffProps = {
  onComplete: () => void;
};

/** Ink puffs laid out L→R — delays are fractions of planeDuration (plane leads). */
const SMOKE_PUFFS = [
  { left: '6%', top: '34%', w: 28, delay: 0.28 },
  { left: '14%', top: '48%', w: 34, delay: 0.34 },
  { left: '22%', top: '38%', w: 40, delay: 0.4 },
  { left: '32%', top: '44%', w: 36, delay: 0.46 },
  { left: '42%', top: '36%', w: 44, delay: 0.52 },
  { left: '52%', top: '46%', w: 38, delay: 0.58 },
  { left: '62%', top: '40%', w: 42, delay: 0.64 },
  { left: '72%', top: '48%', w: 36, delay: 0.7 },
  { left: '82%', top: '38%', w: 40, delay: 0.76 },
] as const;

/**
 * Click-triggered intro → space handoff:
 * plane flies L→R with ink blooming just behind it, then the page floods black.
 */
function IntroSpaceHandoff({ onComplete }: IntroSpaceHandoffProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Space bed under the blackout; reveal leads the Space stage by ~1.5s.
    playLoop('space', 'space', { volume: 0.1, fadeIn: 1.4 });
    playTransitionOnce('space-reveal', 'spaceReveal', {
      volume: 0.7,
      fadeIn: 0.3,
      fadeOut: 1.8,
      maxDuration: 5,
      delay: 3.2,
    });

    const plane = root.querySelector<HTMLElement>('.intro-handoff-plane');
    const puffs = gsap.utils.toArray<HTMLElement>('.intro-handoff-puff', root);
    const curls = gsap.utils.toArray<SVGPathElement>(
      '.intro-handoff-ink-curl',
      root,
    );
    const veil = root.querySelector<HTMLElement>('.intro-handoff-veil');

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete();
    };

    const ctx = gsap.context(() => {
      gsap.set(plane, {
        x: -360,
        top: '36%',
        left: 0,
        y: 0,
        opacity: 1,
        rotate: -6,
      });
      gsap.set(puffs, {
        scale: 0.12,
        opacity: 0,
        transformOrigin: '50% 50%',
      });
      gsap.set(curls, { opacity: 0 });
      for (const path of curls) {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      }
      gsap.set(veil, { opacity: 0, scale: 0.15 });

      const parked = document.querySelector('.intro-transition-plane');
      if (parked) gsap.set(parked, { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onComplete: finish,
      });

      const planeDuration = 2.35;

      tl.to(
        plane,
        {
          x: () => window.innerWidth + 280,
          y: -28,
          rotate: 4,
          duration: planeDuration,
          ease: 'power1.inOut',
        },
        0,
      );

      // Each puff appears after the plane has already passed that slice.
      puffs.forEach((puff, index) => {
        const start = planeDuration * SMOKE_PUFFS[index].delay;

        tl.to(
          puff,
          {
            opacity: 1,
            scale: 1,
            duration: 0.55,
            ease: 'power2.out',
          },
          start,
        );

        // Slow wake growth behind the plane.
        tl.to(
          puff,
          {
            scale: 2.2,
            duration: planeDuration - start + 0.85,
            ease: 'power1.in',
          },
          start + 0.35,
        );
      });

      curls.forEach((curl, index) => {
        const start = planeDuration * (0.32 + index * 0.12);
        tl.to(
          curl,
          {
            opacity: 0.9,
            strokeDashoffset: 0,
            duration: 0.85,
            ease: 'power1.out',
          },
          start,
        );
      });

      // After the plane leaves, slowly flood the page to solid black.
      tl.to(
        puffs,
        {
          scale: 5.5,
          duration: 1.25,
          stagger: 0.05,
          ease: 'power2.in',
        },
        planeDuration * 0.92,
      );

      tl.to(
        veil,
        {
          opacity: 1,
          scale: 5,
          duration: 1.3,
          ease: 'power2.in',
        },
        planeDuration * 0.94,
      );

      tl.to(plane, { opacity: 0, duration: 0.2 }, planeDuration - 0.12);
      // Settle on full black before swapping stages — avoids a hard cut.
      tl.to({}, { duration: 0.65 });
    }, root);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={rootRef} className="intro-space-handoff" aria-hidden="true">
      <div className="intro-handoff-smoke">
        {SMOKE_PUFFS.map((puff, index) => (
          <div
            key={index}
            className={`intro-handoff-puff intro-handoff-puff--${(index % 3) + 1}`}
            style={{
              left: puff.left,
              top: puff.top,
              width: `${puff.w}vmin`,
              height: `${puff.w * 0.72}vmin`,
            }}
          />
        ))}
      </div>

      <svg
        className="intro-handoff-ink"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <g
          fill="none"
          stroke="#0a0908"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            className="intro-handoff-ink-curl"
            d="M10 48 C 16 40, 24 40, 28 50 C 30 58, 22 60, 16 54"
          />
          <path
            className="intro-handoff-ink-curl"
            d="M34 44 C 42 36, 52 38, 56 48 C 58 56, 48 58, 42 52"
          />
          <path
            className="intro-handoff-ink-curl"
            d="M58 46 C 66 38, 76 40, 80 50 C 82 58, 72 58, 66 52"
          />
          <path
            className="intro-handoff-ink-curl"
            d="M78 42 C 86 34, 94 38, 96 48 C 94 56, 86 56, 82 50"
          />
        </g>
      </svg>

      <div className="intro-handoff-veil" />

      <IntroPlaneSvg className="intro-handoff-plane" />
    </div>
  );
}

export default IntroSpaceHandoff;
