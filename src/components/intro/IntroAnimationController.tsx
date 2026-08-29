import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';

type IntroAnimationControllerProps = {
  children: ReactNode;
};

/**
 * GSAP director for the intro page.
 *
 * On mount it:
 * 1. Hides doodles / polaroids / notes / signature (gsap.set)
 * 2. Prepares SVG strokes with stroke-dasharray = path length and
 *    stroke-dashoffset = path length (the line is “invisible”)
 * 3. Tweens dashoffset → 0 so each stroke looks like it is being drawn
 * 4. Starts gentle idle loops (wiggle, float) after the entrance
 *
 * `gsap.utils.toArray('.class', root)` is “querySelectorAll, but a real array”.
 * `gsap.context` + revert() cleans tweens if we leave the intro mid-animation.
 */
function IntroAnimationController({ children }: IntroAnimationControllerProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let ctx: gsap.Context | undefined;
    try {
    ctx = gsap.context(() => {
      const doodles = gsap.utils.toArray<SVGElement>('.intro-doodle', root);
      const plane = root.querySelector<SVGElement>('.intro-transition-plane');
      const doodleStrokes = gsap.utils.toArray<SVGPathElement | SVGCircleElement>(
        '.intro-doodle-stroke',
        root,
      );
      const pictures = gsap.utils.toArray<HTMLElement>('.intro-polaroid', root);
      const notes = gsap.utils.toArray<HTMLElement>('.intro-note', root);
      const noteStrokes = gsap.utils.toArray<SVGPathElement>(
        '.intro-annotation-stroke',
        root,
      );
      const subtitle = root.querySelector<HTMLElement>('.intro-subtitle');
      const letters = gsap.utils.toArray<SVGPathElement>(
        '.intro-signature-letter',
        root,
      );
      const fills = gsap.utils.toArray<SVGPathElement>(
        '.intro-signature-fill',
        root,
      );
      const sketches = gsap.utils.toArray<SVGPathElement>(
        '.intro-signature-sketch',
        root,
      );
      const accents = gsap.utils.toArray<SVGPathElement>(
        '.intro-signature-underline, .intro-signature-flourish',
        root,
      );
      const startButton = root.querySelector<HTMLElement>('.intro-start-button');

      const idleDoodles = doodles.filter((el) => el !== plane);
      const entranceDoodles = idleDoodles;

      gsap.set(entranceDoodles, { opacity: 0, scale: 0.4, rotate: -10 });
      if (plane) gsap.set(plane, { opacity: 0, scale: 0.4, rotate: -18 });
      gsap.set(pictures, { opacity: 0, y: 22, rotate: -5 });
      gsap.set(notes, { opacity: 0, y: 8 });
      gsap.set(fills, { opacity: 0 });
      if (subtitle) gsap.set(subtitle, { opacity: 0, y: 10 });
      if (startButton) {
        gsap.set(startButton, {
          opacity: 0,
          xPercent: -50,
          y: 18,
          rotate: -2,
          pointerEvents: 'none',
        });
      }

      const prepareStroke = (path: SVGGeometryElement) => {
        try {
          if (typeof path.getTotalLength !== 'function') return;
          const length = path.getTotalLength();
          if (!Number.isFinite(length) || length <= 0) return;
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        } catch {
          // Some mobile engines throw on ellipse/circle getTotalLength.
        }
      };

      for (const path of [
        ...letters,
        ...sketches,
        ...accents,
        ...doodleStrokes,
        ...noteStrokes,
      ]) {
        prepareStroke(path);
      }

      const strokeDuration = (target: SVGPathElement) => {
        try {
          if (typeof target.getTotalLength !== 'function') return 0.55;
          const length = target.getTotalLength();
          if (!Number.isFinite(length) || length <= 0) return 0.55;
          return Math.max(0.4, Math.min(1.15, length / 900));
        } catch {
          return 0.55;
        }
      };

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.to(entranceDoodles, {
        opacity: 1,
        scale: 1,
        rotate: (index: number) => (index % 2 === 0 ? -5 : 6),
        duration: 0.55,
        stagger: 0.07,
      });

      if (plane) {
        tl.to(
          plane,
          {
            opacity: 1,
            scale: 1,
            rotate: -18,
            duration: 0.55,
          },
          '-=0.4',
        );
      }

      if (doodleStrokes.length > 0) {
        tl.to(
          doodleStrokes,
          {
            strokeDashoffset: 0,
            duration: 0.7,
            stagger: 0.03,
            ease: 'power1.out',
          },
          '-=0.35',
        );
      }

      tl.to(
        pictures,
        {
          opacity: 1,
          y: 0,
          rotate: (index: number) => (index % 2 === 0 ? -6 : 5),
          duration: 0.65,
          stagger: 0.12,
        },
        '-=0.45',
      );

      if (letters.length > 0) {
        tl.to(
          letters,
          {
            strokeDashoffset: 0,
            duration: (_i: number, target: SVGPathElement) =>
              strokeDuration(target),
            stagger: 0.1,
            ease: 'none',
          },
          '-=0.1',
        );

        tl.to(
          fills,
          {
            opacity: 1,
            duration: 0.45,
            stagger: 0.1,
            ease: 'power1.out',
          },
          '<0.28',
        );

        tl.to(
          sketches,
          {
            strokeDashoffset: 0,
            duration: (_i: number, target: SVGPathElement) =>
              strokeDuration(target) * 0.85,
            stagger: 0.1,
            ease: 'none',
          },
          '<0.12',
        );
      }

      if (accents.length > 0) {
        tl.to(
          accents,
          {
            strokeDashoffset: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power1.inOut',
          },
          '-=0.35',
        );
      }

      tl.to(
        letters,
        {
          opacity: 0.18,
          duration: 0.4,
          ease: 'power1.out',
        },
        '-=0.15',
      ).to(
        sketches,
        {
          opacity: 0,
          duration: 0.35,
          ease: 'power1.out',
        },
        '<',
      );

      if (subtitle) {
        tl.to(
          subtitle,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
          },
          '-=0.1',
        );
      }

      if (notes.length > 0) {
        tl.to(
          notes,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.1,
          },
          '-=0.25',
        );
      }

      if (noteStrokes.length > 0) {
        tl.to(
          noteStrokes,
          {
            strokeDashoffset: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: 'power1.out',
          },
          '-=0.35',
        );
      }

      tl.to({}, { duration: 0.55 });

      // CTA waits until the page has fully settled.
      if (startButton) {
        tl.to(startButton, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
          onStart: () => {
            startButton.style.pointerEvents = 'auto';
          },
        });
      }

      if (idleDoodles.length > 0) {
        gsap.to(idleDoodles, {
          y: (index: number) => (index % 2 === 0 ? -5 : 6),
          rotate: (index: number) => (index % 2 === 0 ? -7 : 7),
          duration: (index: number) => 2.6 + (index % 4) * 0.35,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.15,
          delay: tl.duration(),
        });
      }

      // Plane keeps a calmer hover — ready to become the space transition cue.
      if (plane) {
        gsap.to(plane, {
          y: '-=5',
          x: '+=4',
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: tl.duration(),
        });
      }

      gsap.to(pictures, {
        y: '+=5',
        rotate: '+=1.5',
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.35,
        delay: tl.duration(),
      });

      gsap.to(notes, {
        y: '+=3',
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.25,
        delay: tl.duration(),
      });
    }, root);
    } catch {
      const scope = root.closest('.intro-experience') ?? root;
      const desktop = scope.querySelector<HTMLElement>('.intro-start-button');
      const mobile = scope.querySelector<HTMLElement>('.intro-mobile-start');
      if (desktop) {
        desktop.style.opacity = '1';
        desktop.style.pointerEvents = 'auto';
      }
      if (mobile) {
        mobile.classList.add('is-visible');
      }
    }

    return () => ctx?.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="intro-scene"
      aria-label="Notebook intro"
    >
      {children}
    </div>
  );
}

export default IntroAnimationController;
